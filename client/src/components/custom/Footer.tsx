import Link from "next/link";

const Footer = () => {
  return (
    <div className="footer">
      <p>&copy;2024 HOPH - All Rights Reserved.</p>

      <div className="footer__links ">
        {["About", "Privacy Policy", "Licensing", "Contact"].map((item) => (
          <Link
          scroll={false}
            key={item}
            href={`/${item.toLowerCase().replace(" ", "-")}`}
            className="footer__link "
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Footer;
