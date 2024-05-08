import { useNavigate } from "react-router-dom";
import { TbExclamationMark } from "react-icons/tb";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-100 dark:bg-[#192023]">
      <div className="container flex items-center p-6 mx-auto my-20">
        <div className="flex flex-col items-center mx-auto text-center">
          <p className="p-3 text-sm font-medium rounded-full border-solid border-2 border-gray-800 dark:border-gray-200 bg-blue-50 dark:bg-gray-800">
            <TbExclamationMark size={30} />
          </p>
          <h1 className="mt-3 text-3xl font-semibold dark:text-white">
            404 Page not found
          </h1>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            The page you are looking for doesn't exist.
          </p>
          <div className="flex items-center m-6 sm:w-auto">
            <button
              className="px-5 py-2 text-white bg-[#63d052] rounded-lg hover:bg-[#83d052] dark:hover:bg-[#63d052] dark:bg-[#83d052]"
              onClick={() => navigate("/")}
            >
              Home page
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
