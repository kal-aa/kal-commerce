import Image from "next/image";
import Link from "next/link";

export default async function AboutUsPage() {
  const headingStyle = "text-[24px] border-b-2 pb-2 mb-3";

  return (
    <div className="mt-[110px] mx-[5%] px-[10%] p-3 flex flex-col shadow-2xl items-center">
      {/* Hero Section */}
      <section className="mb-2">
        <p className="md:px-5">
          <span className="text-3xl font-black">Welcome</span> to{" "}
          <strong>Abstruse Co.</strong>, where we are dedicated to delivering
          innovative solutions to transform the way you live and work.
        </p>
      </section>

      {/* Mission and Vision */}
      <section className="mb-2">
        <h2 className={headingStyle}>Our Mission</h2>
        <p>
          To empower individuals and businesses with cutting-edge technology and
          personalized services.
        </p>
        <h2 className={headingStyle}>Our Vision</h2>
        <p>
          To be a global leader in innovation, sustainability, and customer
          satisfaction.
        </p>
      </section>

      {/* Team Section */}
      <section className="mb-2">
        <h2 className={`${headingStyle} text-center`}>Meet Our Team</h2>
        <div className="flex flex-col gap-y-5 sm:flex-row sm:gap-x-10">
          <div className="flex flex-col items-center">
            <Link href="/images?imgUrl=others/kalab.jpg">
              <Image
                width={100}
                height={0}
                src="/images/others/kalab.jpg"
                alt="kalab CEO"
                className="rounded-full w-24 "
              />
            </Link>
            <strong>Kalab Sisay</strong>
            <p>CEO</p>
          </div>
          <div className="flex flex-col items-center">
            <Link href="/images?imgUrl=others/khalid.jpg">
              <Image
                width={100}
                height={0}
                src="/images/others/khalid.jpg"
                alt="khalid CTO"
                className="rounded-full w-24 "
              />
            </Link>
            <strong>Khalid Endris</strong>
            <p>CTO</p>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="mb-2">
        <h2 className={headingStyle}>Our Achievements</h2>
        <ul>
          <li>Serving over 10,000 satisfied customers worldwide.</li>
          <li>Awarded &quot;Best Tech Startup 2023&quot; by TechWorld.</li>
          <li>Partnered with top-tier organizations across 20 countries.</li>
        </ul>
      </section>

      {/* Call to Action */}
      <section className="mb-2">
        <h2 className={headingStyle}>Get in Touch</h2>
        <p>
          Have questions or want to work with us?{" "}
          <Link
            href={`/contact-us/`}
            target=""
            className="text-blue-900 hover:text-blue-700 dark:text-blue-500"
          >
            Contact us
          </Link>{" "}
          today!
        </p>
      </section>
    </div>
  );
}
