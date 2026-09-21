'use client';

import { faqData } from '@/data/faqData';

export default function FaqAccordion() {
  return (
    <div className="faq-accordion-wrap">
      {faqData.map((item, idx) => (
        <details key={idx} className="faq-accordion-item" open={idx === 0}>
          <summary className="faq-summary">
            <h3 className="faq-question-text">{item.question}</h3>
            <span className="faq-icon" aria-hidden="true" />
          </summary>
          <div className="faq-answer">
            <p>{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
