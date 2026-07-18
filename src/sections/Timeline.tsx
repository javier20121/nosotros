import { motion } from 'framer-motion';
import type { TimelineMilestone } from '@/types';

interface TimelineProps {
  milestones: TimelineMilestone[];
}

export default function Timeline({ milestones }: TimelineProps) {
  return (
    <section
      id="timeline"
      className="py-20 sm:py-28 px-4"
      style={{ backgroundColor: 'var(--cream)' }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: 'var(--graphite)',
              fontWeight: 400,
            }}
          >
            Nuestra Historia
          </h2>
          <div
            className="mt-3"
            style={{
              width: '80px',
              height: '2px',
              backgroundColor: 'var(--soft-pink)',
            }}
          />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center Line */}
          <div
            className="absolute left-8 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5"
            style={{ backgroundColor: 'rgba(243, 198, 209, 0.3)' }}
          />

          {/* Milestones */}
          <div className="space-y-12 md:space-y-16">
            {milestones.map((milestone, index) => {
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={milestone.id}
                  className={`relative flex items-start gap-8 md:gap-0 ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Connector Dot */}
                  <div
                    className="absolute left-8 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-[3px] z-10"
                    style={{
                      backgroundColor: 'var(--soft-pink)',
                      borderColor: 'white',
                      boxShadow: '0 0 0 3px rgba(243, 198, 209, 0.3)',
                      top: '1.5rem',
                    }}
                  />

                  {/* Card */}
                  <div
                    className={`ml-16 md:ml-0 md:w-[45%] ${
                      isLeft ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'
                    }`}
                  >
                    <div className="card-romantic p-5 sm:p-6">
                      {/* Date Badge */}
                      <span
                        className="inline-block rounded-full px-3 py-1 font-body text-xs font-semibold mb-3"
                        style={{
                          backgroundColor: 'rgba(243, 198, 209, 0.15)',
                          color: 'var(--blush)',
                        }}
                      >
                        {milestone.date}
                      </span>

                      {/* Title */}
                      <h3
                        className="font-display text-xl sm:text-[1.25rem] mb-2"
                        style={{ color: 'var(--graphite)', fontWeight: 500 }}
                      >
                        {milestone.title}
                      </h3>

                      {/* Description */}
                      <p
                        className="font-body text-sm sm:text-base leading-relaxed"
                        style={{ color: 'rgba(44, 44, 44, 0.7)' }}
                      >
                        {milestone.description}
                      </p>

                      {/* Image */}
                      {milestone.image && (
                        <motion.img
                          src={milestone.image}
                          alt={milestone.title}
                          className="w-full mt-4 rounded-2xl object-cover"
                          style={{ aspectRatio: '16/10' }}
                          loading="lazy"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
