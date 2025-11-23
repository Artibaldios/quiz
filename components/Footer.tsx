import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="text-center p-2 text-textColor">
        &copy; {new Date().getFullYear()} Artibaldios. All rights reserved.
    </footer>
  );
};

export default Footer;