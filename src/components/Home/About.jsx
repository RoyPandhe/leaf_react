// src/components/Home/About.jsx
import React from 'react';
import './About.css'; // Pastikan mengimpor stylesheet

const About = () => {
  return (
    <section className="about">
      <div className="about-content">
        <h2 className="about-title">Meaning of Consume or Avoid</h2>
        <p className="about-description">
        What does Consume or Avoid mean?
In mountainous areas, especially the mountains of Java, of course there is a lot of biodiversity. Of all the biodiversity that exists, of course there are some that can be eaten or consumed by humans, and some that cannot.

Through this EcoVision website, you can find out whether the plants you find in the mountainous area can be consumed or not.

Which will be classified into 2 types, namely edible and non-edible. Edible is a plant whose leaves can be consumed and are efficacious. While the results for non-edible are types of leaves that cannot be consumed, and can be poisonous.
        </p>
        <p className="about-mission">
          Our mission is to bridge the gap between technology and nature, making the process of learning about plants engaging and accessible to everyone.
        </p>
      </div>
    </section>
  );
};

export default About;
