
export default function homepage() {
    return (
      <div className="homepage-container">
        {/* Inline Style */}
        <style>
          {`
            .homepage-container {
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: top;
              min-height: 50vh;
              background: linear-gradient(135deg, #4a90e2, #50c878);
              color: white;
              text-align: center;
              padding: 20px;
            }
  
         
            .aims-subheading {
              font-size: 20px;
              line-height: 1.6;
              width : 90%;
              margin-top: 20px;
              margin-bottom: 20px;
            }
            
            .aims-subheading {
                transition: transform 0.4s ease, box-shadow 0.4s ease; /* Smooth scaling and shadow transition */
              }

            .aims-subheading:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 15px rgba(54, 103, 148, 0.45);
              }

  
            .footer {
              margin-top: 40px;
              font-size: 14px;
              color: rgba(255, 255, 255, 0.7);
            }
          `}
        </style>
        {/* Subheading */}
        <p className="aims-subheading"> <font face="Courier">
          Welcome to the Academic Information and Management System (AIMS)! 
          As a student, you can easily manage your academic journey here. 
          Enroll in the courses floated by your instructors or drop them as needed. 
          Our system is designed to make your academic management seamless and efficient.
          </font>
        </p>
  
        {/* Footer */}
        <div className="footer">
          © 2025 AIMS | G4
        </div>
      </div>
    );
  }
  
