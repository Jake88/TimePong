/**
 * Example usage of the converted icon components
 *
 * This file demonstrates how to use the icon components in your React application.
 * Delete this file once you're familiar with the usage.
 */

import React from 'react';
import {
  // Card Type Icons
  Cauldron,
  Action,
  Challenge,
  Spell,

  // Utility Icons
  Angel,
  Duration,

  // Card Images
  Fetch,
  Waterfall,
  TheWitchsCauldron,
} from './index';

export const IconExamples: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Icon Component Examples</h1>

      <section style={{ marginBottom: '30px' }}>
        <h2>Card Type Icons</h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Cauldron size={50} fill="#9c27b0" />
          <Action size={50} fill="#f44336" />
          <Challenge size={50} fill="#ff9800" />
          <Spell size={50} fill="#2196f3" />
        </div>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>Utility Icons</h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Angel size={50} fill="#4caf50" />
          <Duration size={50} fill="#00bcd4" />
        </div>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>Card Images</h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Fetch size={50} />
          <Waterfall size={50} />
          <TheWitchsCauldron size={50} />
        </div>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>With Custom Styling</h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Cauldron
            size={64}
            fill="#e91e63"
            className="animated-icon"
            style={{
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
              transition: 'transform 0.2s',
              cursor: 'pointer',
            }}
          />
          <Action
            size="5rem"
            fill="currentColor"
            style={{ color: '#673ab7' }}
          />
        </div>
      </section>

      <section>
        <h2>Responsive Sizing</h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Challenge size={24} fill="#9e9e9e" />
          <Challenge size={36} fill="#757575" />
          <Challenge size={48} fill="#616161" />
          <Challenge size={64} fill="#424242" />
          <Challenge size={80} fill="#212121" />
        </div>
      </section>
    </div>
  );
};

export default IconExamples;
