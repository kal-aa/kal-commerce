import Link from "next/link";
import {
  FaPhone,
  FaEnvelope,
  FaLinkedin,
  FaFacebook,
  FaMapMarker,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa";

export default function ContactUsPage() {
  const socailMediaStyle = " hover:text-blue-600 inline";

  return (
    <div className="mt-[110px] mx-[5%] px-[5%] md:text-center shadow-2xl">
      <div>
        <h1 className="text-2xl -ml-1">Contact us</h1>
        <p>
          We’re here to help! Feel free to reach out to us using any of the
          methods below.
        </p>
      </div>
      <section className="border-b-4 pb-2 my-6 md:inline-block md:mr-[3%]">
        <h2 className="text-xl md:mr-2">Phone:</h2>
        <Link href="tel: +251968350741" target="_blank">
          <FaPhone className="inline mr-2 text-green-500 mb-1" />
          <p className="inline hover:text-neutral-500">+251 968350741</p>
        </Link>
        <p>Availabel: Monday to Monday, 9:00 AM - 5:00 PM</p>
      </section>
      <section className="border-b-4 pb-2 md:inline-block md:ml-[3%]">
        <div>
          <h2 className="text-xl md:mr-2">Email:</h2>
          <Link href="mailto: sadkalshayee@gmail.com" target="_blank">
            <FaEnvelope className="inline mr-2 text-blue-800 mb-1" />
            <p className="inline hover:text-neutral-500">
              sadkalshayee@gmail.com
            </p>
          </Link>
          <p>We aim to respond within 24 hours</p>
        </div>
      </section>
      <section className="my-6 border-b-4 pb-2">
        <h2 className="text-xl">Address:</h2>
        <FaMapMarker className="inline mr-2 mb-1 text-red-500" />
        <p className="inline">
          Ethiopia, Qobo<span className="text-xs">(for the time being)</span>
        </p>
      </section>
      <section>
        <h2 className="text-xl">Social Media</h2>
        <p>Follow us on social media for the latest updates</p>
        <div className="flex flex-col gap-1 mt-2 pl-5 md:items-center">
          <Link href="https://t.me/@Silent7951" target="_blank">
            <p className={socailMediaStyle}>Telegram</p>
            <FaTelegram className="inline text-purple-900 ml-1 dark:text-white" />
          </Link>
          <Link
            href="https://web.facebook.com/profile.php?id=61572989257505"
            target="_blank"
          >
            <p className={socailMediaStyle}>Facebook</p>
            <FaFacebook className="inline text-blue-800 mb-1 ml-1" />
          </Link>
          <Link href="https://wa.me/+251968350741" target="_blank">
            <p className={socailMediaStyle}>WhatsApp</p>
            <FaWhatsapp className="inline text-green-500 mb-1 ml-1" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/kalab-sisay-881139351/"
            target="_blank"
          >
            <p className={socailMediaStyle}>Linkedin </p>
            <FaLinkedin className="inline text-blue-600 mb-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
