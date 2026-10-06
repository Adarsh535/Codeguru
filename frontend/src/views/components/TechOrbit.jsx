'use client';

import React from 'react';
import './TechOrbit.css';

/**
 * 16 Top Technology Skills Array for rich, dense circular orbit layout
 */
const TECH_SKILLS = [
  { name: 'React.js', color: '#61DAFB', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'JavaScript', color: '#F7DF1E', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'Node.js', color: '#339933', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name: 'Express.js', color: '#68A063', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
  { name: 'MongoDB', color: '#47A248', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'HTML5', color: '#E34F26', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { name: 'CSS3', color: '#1572B6', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
  { name: 'Git', color: '#F05032', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'PHP', color: '#777BB4', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
  { name: 'Android', color: '#3DDC84', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg' },
  { name: 'Flutter', color: '#02569B', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
  { name: 'Next.js', color: '#000000', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
  { name: 'Laravel', color: '#FF2D20', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg' },
  { name: 'Python', color: '#3776AB', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'Java', color: '#007396', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { name: 'Angular', color: '#DD0031', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg' },
];

export default function TechOrbit({
  centerImageSrc = '/images/codeguru-guru-logo.png',
  onOpenContactModal
}) {
  const totalSkills = TECH_SKILLS.length;

  return (
    <div className="tech-orbit__wrapper">
      {/* Ambient Radial Background Glow */}
      <div className="tech-orbit__glow" />

      {/* Outer Primary Dashed Orbit Ring */}
      <div className="tech-orbit__dashed-ring" />

      {/* Inner Accent Glow Ring */}
      <div className="tech-orbit__inner-ring" />

      {/* Rotating 360-degree Orbit Spinner Container */}
      <div className="tech-orbit__spinner">
        {TECH_SKILLS.map((skill, index) => {
          // Compute trigonometric unit circle factors starting top (-Math.PI / 2)
          const angleRad = (index * 2 * Math.PI) / totalSkills - Math.PI / 2;
          const xFactor = Math.cos(angleRad);
          const yFactor = Math.sin(angleRad);

          return (
            <div
              key={skill.name}
              className="tech-orbit__item-position"
              style={{
                '--x-factor': xFactor,
                '--y-factor': yFactor,
                '--brand-color': skill.color
              }}
            >
              <button
                onClick={onOpenContactModal}
                className="tech-orbit__badge"
                title={skill.name}
                aria-label={skill.name}
              >
                <img
                  src={skill.src}
                  alt={skill.name}
                  className="tech-orbit__icon"
                />
                <span className="tech-orbit__tooltip">{skill.name}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Center Master CodeGuru Logo - ENLARGED */}
      <div
        className="tech-orbit__center"
        onClick={onOpenContactModal}
        title="Click to Inquire with CodeGuru"
      >
        <img
          src={centerImageSrc}
          alt="CodeGuru Master Logo"
          className="tech-orbit__image"
        />
      </div>
    </div>
  );
}
