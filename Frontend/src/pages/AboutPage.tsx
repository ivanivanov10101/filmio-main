import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="flex justify-center mx-5 my-36 flex-1">
      <div className="text-center">
        <h1 className="text-2xl font-bold m-9">About Filmio</h1>
        <div className="flex flex-col gap-4">
          <p>
            Filmio is a portfolio project website made by{" "}
            <Link
              to={"https://www.linkedin.com/in/ivan-ivanov-101/"}
              className="text-gray-800 hover:text-gray-400 dark:text-gray-300 dark:hover:text-white"
            >
              Ivan Ivanov
            </Link>
            .
          </p>
          <p>
            It was built using ReactJS, MongoDB, Tanstack Query, Redux,
            Flowbite.
          </p>
          <p>The backend is using Express, MongoDB and Firebase.</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
