import { Footer } from "flowbite-react";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { Link } from "react-router-dom";

const FooterComponent = () => {
  return (
    <Footer container className="border-t-4 dark:border-neutral-800 dark:bg-[rgba(49,57,66,1)]">
      <div className="w-full mx-auto max-w-6xl">
        <div className="flex flex-col justify-between md:flex-row md:px-14">
          <div className="mb-5 md:mb-0">
            <Link
              to={"/"}
              className="self-center text-lg font-semibold whitespace-nowrap sm:text-xl dark:text-white"
              aria-label="Home Page"
            >
              <div className="w-[150px] md:w-[200px]">
                <img src="/assets/images/logo_sm.webp" alt="logo" />
              </div>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-10">
            <div>
              <Footer.Title title="Follow Us" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://github.com/ivanivanov101"
                  target="_blank"
                  aria-label="GitHub Link"
                  rel="noopener noreferrer"
                >
                  Github
                </Footer.Link>
                <Footer.Link
                  href="https://www.linkedin.com/in/ivan-ivanov-101/"
                  target="_blank"
                  aria-label="LinkedIn Link"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="LEGAL" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="#"
                  target="_blank"
                  aria-label="Privacy Policy"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </Footer.Link>
                <Footer.Link
                  href="#"
                  target="_blank"
                  aria-label="Terms & Conditions"
                  rel="noopener noreferrer"
                >
                  Terms & Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <div className="w-full sm:flex sm:items-center sm:justify-between sm:px-5 my-2">
          <Footer.Copyright by="Ivan Ivanov" year={2024} />
          <div className="flex gap-8 mt-4 md:mt-0 md:justify-center">
            <Footer.Icon
              href="https://www.linkedin.com/in/ivan-ivanov-101/"
              icon={BsLinkedin}
            />
            <Footer.Icon
              href="https://github.com/ivanivanov101/"
              icon={BsGithub}
            />
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComponent;
