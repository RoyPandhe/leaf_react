import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  const contributors = [
    {
      name: 'Reivan Haidar Ghiffari',
      role: 'Project Manager',
      photo: '/images/reivan.png',
      description: 'Responsible for scheduling, ensuring all tasks are completed on time, and acting as the liaison between developers and stakeholders.',
    },
    {
      name: 'Emha Aji Putra Zaman',
      role: 'Web Developer',
      photo: '/images/emha.png',
      description: 'Handles frontend and backend implementation, ensuring the application runs smoothly and efficiently.',
    },
    {
      name: 'Ivan Roy Pandhe',
      role: 'Architecture Designer',
      photo: '/images/ivan.jpeg',
      description: 'Designs the application architecture to ensure scalability and efficiency, including utilizing cloud services like AWS.',
    },
    {
      name: 'Putu Dewi Andriani',
      role: 'Data Analyst',
      photo: '/images/putu.png',
      description: 'Processes user data to provide critical insights, including analyzing plant recognition results and enhancing app features.',
    },
    {
      name: 'Riva Aries Putri',
      role: 'Data Analyst',
      photo: '/images/riva.png',
      description: 'Focuses on data processing and visualization to ensure valuable insights for improving user experiences and application outcomes.',
    },
    {
      name: 'M Ramadhan T N',
      role: 'Data Analyst',
      photo: '/images/ramadhan.png',
      description: 'Works on statistical modeling and data cleaning to support analytics-driven decision-making for the app.',
    },
    {
      name: 'Ajriyatussururi Putri  ',
      role: 'Data Analyst',
      photo: '/images/riri.png',
      description: 'Collaborates on developing data pipelines and ensures accurate reporting of app performance metrics.',
    },
    {
      name: 'Harsdyka Wibisono',
      role: 'Data Analyst',
      photo: '/images/wibi.png',
      description: 'Specializes in data integration and analysis to improve the quality and reliability of plant identification results.',
    },
    {
      name: 'Rama Amanda Amelia',
      role: 'Data Analyst',
      photo: '/images/manda.png',
      description: 'Specializes in data integration and analysis to improve the quality and reliability of plant identification results.',
    },
  ];

  return (
    <div className="about-page">
      <h1>About Us</h1>
      <p>
        This website is built by a dedicated team with expertise across various aspects of development, from project management to data analytics.
      </p>

      {/* Latar Belakang Proyek */}
      <section className="project-background">
        <h2>Project Background</h2>
        <p>
          The idea for this project originated from the need to provide a simple yet powerful tool to help users identify plants easily. 
          By leveraging cutting-edge AI and cloud technologies, this application aims to educate and inspire people to learn more about nature.
        </p>
      </section>

      {/* Visi & Misi */}
      <section className="vision-mission">
        <h2>Our Vision & Mission</h2>
        <div className="vision">
          <h3>Vision</h3>
          <p>
            To become the leading platform for plant identification, education, and conservation through technology.
          </p>
        </div>
        <div className="mission">
          <h3>Mission</h3>
          <ul>
            <li>To provide accurate plant recognition results using AI-powered tools.</li>
            <li>To educate users about the natural world in an interactive and engaging way.</li>
            <li>To create a scalable platform that benefits individuals, researchers, and educators.</li>
          </ul>
        </div>
      </section>

      {/* Judul Tim */}
      <h1 className="team-title">Our Team</h1>

      {/* Profil Tim */}
      <div className="contributors">
        {contributors.map((person, index) => (
          <div key={index} className="contributor-card">
            <div className="photo-frame">
              <img src={person.photo} alt={person.name} className="contributor-photo" />
            </div>
            <h2>{person.name}</h2>
            <p className="role">{person.role}</p>
            <p className="description">{person.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
