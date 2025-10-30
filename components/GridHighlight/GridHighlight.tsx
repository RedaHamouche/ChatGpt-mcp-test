import styles from './GridHighlight.module.scss';

const metrics = [
  { value: '+45', label: 'interfaces animées récompensées' },
  { value: '12', label: 'marques propulsées à l’international' },
  { value: '97%', label: 'de clients qui me recommandent' },
  { value: '4.9/5', label: 'de satisfaction moyenne' },
];

export default function GridHighlight() {
  return (
    <section className={styles.metrics} data-animate="metrics">
      {metrics.map((metric) => (
        <article key={metric.value} className={styles.metric}>
          <h3 className={styles.metricValue}>{metric.value}</h3>
          <p className={styles.metricLabel}>{metric.label}</p>
        </article>
      ))}
    </section>
  );
}
