
export default function adpage() {
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
      min-height: 40vh;
      background: linear-gradient(135deg, #007BFF, #28a745); /* Blue to Green Gradient */
      color: white;
      text-align: center;
      padding: 20px;
    }

    .aims-subheading {
      font-size: 20px;
      line-height: 1.6;
      width: 90%;
      margin-top: 20px;
      margin-bottom: 20px;
      color: #ffffff; /* Keep text white for contrast */
    }
    
    .aims-subheading {
      transition: transform 0.4s ease, box-shadow 0.4s ease; /* Smooth scaling and shadow transition */
    }

    .aims-subheading:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 15px rgba(0, 123, 255, 0.5); /* Subtle glow with blue */
    }

    .footer {
      margin-top: 40px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8); /* Slightly more opaque for readability */
    }
  `}
</style>

        {/* Subheading */}
        <p className="aims-subheading"> <font face="Courier">
          Welcome to the Academic Information and Management System (AIMS)!<br/>
          As an <b>Admin</b>, you have the abilty to create new users, update and delete the existing ones.<br/>
          You can also assign Faculty Advisors to Students.  
          </font>
        </p>
  
        {/* Footer */}
        <div className="footer">
          © 2025 AIMS | G4
        </div>
      </div>
    );
  }
  
