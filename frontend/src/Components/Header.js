
export default function Header(){
    return (
        <div>
          <style>
            {`
              .aims-heading {
                background-color: black;
                color: white;
                padding: 20px;
                text-align: center;
                font-size: 36px;
                border-radius: 10px;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
              }
    
              .aims-heading:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
              }
            `}
          </style>
          <h1 className="aims-heading">ACADEMIC INFORMATION AND MANAGEMENT SYSTEM</h1>
        </div>
      );
}

