import { Star } from "lucide-react";

function ReviewsSection({ testimonials }) {
  return (
    <section className="reviews-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            <Star size={16} />
            Reviews
          </span>
          <h2>Recent client notes</h2>
        </div>
      </div>

      <div className="review-grid">
        {testimonials.map((review) => (
          <article className="review-card" key={review.id}>
            <div className="stars" aria-label={`${review.rating} star rating`}>
              {Array.from({ length: review.rating }).map((_, index) => (
                <Star key={index} size={16} fill="currentColor" />
              ))}
            </div>
            <p>{review.text}</p>
            <strong>{review.name}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ReviewsSection;
