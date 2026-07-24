const fs = require('fs');

const path = 'src/hooks/useLocalStorage.ts';
let content = fs.readFileSync(path, 'utf8');

// The crud functions text to insert
const crudFunctions = `
  // Personal Objectives CRUD
  const toggleObjectiveTask = useCallback((objectiveId: string, taskId: string) => {
    setData(prev => ({
      ...prev,
      personalObjectives: prev.personalObjectives.map(obj => {
        if (obj.id !== objectiveId) return obj;
        return {
          ...obj,
          tasks: obj.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
        };
      })
    }));
  }, []);

  const addObjectiveCheckin = useCallback((objectiveId: string, note: string) => {
    const today = new Date().toISOString().split('T')[0];
    setData(prev => ({
      ...prev,
      personalObjectives: prev.personalObjectives.map(obj => {
        if (obj.id !== objectiveId) return obj;
        const hasToday = obj.checkins.some(c => c.date === today);
        if (hasToday) {
          return {
            ...obj,
            checkins: obj.checkins.map(c => c.date === today ? { ...c, note } : c)
          };
        } else {
          return {
            ...obj,
            checkins: [...obj.checkins, { date: today, note }]
          };
        }
      })
    }));
  }, []);

  const addObjective = useCallback((objective: any) => {
    setData(prev => ({
      ...prev,
      personalObjectives: [...prev.personalObjectives, objective]
    }));
  }, []);

  const deleteObjective = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      personalObjectives: prev.personalObjectives.filter(o => o.id !== id)
    }));
  }, []);
`;

// Extract and remove from the end
const marker = '  // Personal Objectives CRUD';
const endMarkerIndex = content.indexOf(marker);
if (endMarkerIndex !== -1) {
  content = content.substring(0, endMarkerIndex); // This removes the CRUD functions from the end of the file
}

// Now find where useAppData returns
const returnStatement = `  return {
    data,
    startDate: START_DATE,
    addGoal,
    updateGoal,
    addPhotoToGoal,
    deletePhotoFromGoal,
    deleteGoal,
    addPhoto,
    deletePhoto,
    addJournalEntry,
    openLetter,
  };`;

if (content.includes(returnStatement)) {
  const newReturnStatement = `  return {
    data,
    startDate: START_DATE,
    addGoal,
    updateGoal,
    addPhotoToGoal,
    deletePhotoFromGoal,
    deleteGoal,
    toggleObjectiveTask,
    addObjectiveCheckin,
    addObjective,
    deleteObjective,
    addPhoto,
    deletePhoto,
    addJournalEntry,
    openLetter,
  };`;
  
  content = content.replace(returnStatement, crudFunctions + '\\n' + newReturnStatement);
  
  // Oh wait, my `lastIndexOf('  return {')` modification had ALSO replaced the `return {` of `calculateTime`?
  // No, `calculateTime` returns `{ years, months, days, hours, minutes, seconds }` inline.
  // Wait, in fix.js I wrote:
  /*
  const returnMatch = /return\\s*{\\s*data,\\s*startDate,([^}]*)\\s*};/;
  const updatedReturn = \`return { ... }\`;
  content = content.replace(returnMatch, updatedReturn);
  */
  // But maybe that failed? Let's ensure it's not at the end anymore.
  
  // Re-add the end of the calculateTime function if it got removed
  if (!content.includes('function calculateTime')) {
     console.error("Missing calculateTime? Something went wrong.");
  }
} else {
  // Try regex if exact string didn't match
  const returnMatch = /return\s*{\s*data,\s*startDate,[\s\S]*?openLetter,\s*};/;
  if (returnMatch.test(content)) {
    const newReturnStatement = `return {
    data,
    startDate: START_DATE,
    addGoal,
    updateGoal,
    addPhotoToGoal,
    deletePhotoFromGoal,
    deleteGoal,
    toggleObjectiveTask,
    addObjectiveCheckin,
    addObjective,
    deleteObjective,
    addPhoto,
    deletePhoto,
    addJournalEntry,
    openLetter,
  };`;
    content = content.replace(returnMatch, crudFunctions + '\\n  ' + newReturnStatement);
  } else {
    console.log("Could not find return statement for useAppData");
  }
}

// Also wait, I removed everything from endMarkerIndex onwards.
// But `calculateTime` is BEFORE the endMarkerIndex?
// Let's check:
// 890: function calculateTime(start: Date) {
// 900:   return { years, ... };
// 779:   // Personal Objectives CRUD
// Wait, 890 > 779! This means calculateTime is AFTER the CRUD functions!
// Wait! In the view_file for 770-830, calculateTime was NOT there!
// 770:   const now = new Date();
// 771:   const diff = now.getTime() - start.getTime();
// 772: 
// 773:   const years = Math.floor...
// 774:   const months = ...
// 775:   const days = ...
// 776:   const hours = ...
// 777:   const minutes = ...
// 778:   const seconds = ...
// 779:   // Personal Objectives CRUD
// 780:   const toggleObjectiveTask = ...
// THIS means I injected the CRUD functions INSIDE calculateTime !!!
// YES! Right before the `return { years, ... }` of calculateTime!
// But wait, my previous fix script used `lastIndexOf('  return {')`.
// So it injected before the `return {` of `calculateTime`.
// And it ALSO replaced the `return {` of calculateTime with the updated `return { data, startDate... }`!
// OMG!
// So `calculateTime` now returns `data, startDate, addGoal...`!
// And `useAppData` returns the original `data, startDate, ... openLetter` because the regex only replaced the LAST one!
// Let's restore the file from HEAD and just run a perfect script.
