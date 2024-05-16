import axios from "axios";
// import poster from "../../public/assets/images/background_hero_compressed.jpg";
// import poster2 from "../../public/assets/images/background_hero_compressed_old.jpg";
interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}

export const handleAxiosError = async (error: unknown) => {
  if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
    return error.response?.data.message;
  } else {
    const err = error as Error;
    return err.message;
  }
};

// export const randomHeader = () => {
//     const posters = [poster, poster2]
//     const index = Math.floor(Math.random() * posters.length)
//     return posters[index];
// }
