import { ShieldCheck, Sparkles } from "lucide-react";

function ServicesSection({ services }) {
  return (
    <section className="services-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            <ShieldCheck size={16} />
            Services
          </span>
          <h2>Everything in one astrology desk</h2>
        </div>
      </div>

      <div className="service-grid">
        {services.map((service) => (
          <article className={`service-card tone-${service.tone}`} key={service.id}>
            <span className="service-icon">
              <Sparkles size={20} />
            </span>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ServicesSection;
