// File: src/components/Hero/Hero.jsx

import classes from "./Hero.module.scss";

const Hero = () => {
  const scrollToJerseys = () => {
    const el = document.getElementById("jerseys");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={classes["hero"]} id="home">
      {/* Decorative background */}
      <div className={classes["bgDecor"]}>
        <div className={classes["bgCircle"]} />
        <div className={classes["bgCircle"]} />
        <div className={classes["bgCircle"]} />
        <div className={classes["bgLines"]} />
        <div className={classes["hexPattern"]} />
      </div>

      <div className={classes["content"]}>
        <div className={classes["eyebrow"]}>
          <span />
          2024 Season Collection
        </div>

        <h1 className={classes["title"]}>
          Football Jerseys
          <br />
          <em>Collection</em>
        </h1>

        <p className={classes["subtitle"]}>
          Professional-grade jerseys crafted for the pitch and the stands.
          Find your club, represent your passion.
        </p>

        <div className={classes["actions"]}>
          <button className={classes["ctaPrimary"]} onClick={scrollToJerseys}>
            Shop Now
          </button>
          <button className={classes["ctaSecondary"]} onClick={scrollToJerseys}>
            View All Jerseys →
          </button>
        </div>

        <div className={classes["statsBar"]}>
          <div className={classes["stat"]}>
            <div className={classes["statValue"]}>150+</div>
            <div className={classes["statLabel"]}>Styles</div>
          </div>
          <div className={classes["stat"]}>
            <div className={classes["statValue"]}>40+</div>
            <div className={classes["statLabel"]}>Clubs</div>
          </div>
          <div className={classes["stat"]}>
            <div className={classes["statValue"]}>5★</div>
            <div className={classes["statLabel"]}>Rated</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
