import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRandomPrompt } from "../utils";
import { FormField, Loader } from "../components";
import { logo_icon } from "../assets";

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });

  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.name && form.prompt && form.photo) {
      setIsLoading(true);

      try {
        const response = await fetch("http://localhost:8080/api/v1/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        await response.json();
        navigate("/");
      } catch (error) {
        alert(error);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please enter a name or prompt and generate an image");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt();
    setForm({ ...form, prompt: randomPrompt });
  };

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setIsGeneratingImage(true);
        const response = await fetch("http://localhost:8080/api/v1/dalle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: form.prompt }),
        });

        const data = await response.json();

        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (error) {
        alert(error);
      } finally {
        setIsGeneratingImage(false);
      }
    } else {
      alert("Please enter a prompt");
    }
  };

  return (
    <section className="max-w-7xl mx-auto bg-red-200">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Imagine to reality</h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">Bring what you have in mind to reality</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-16 max-w-3xl">
        <div className="flex flex-col gap-5">
          <FormField labelName="Your name" type="text" name="name" placeholder="John Doe" value={form.name} handleChange={handleChange} />
          <FormField labelName="Prompt" type="text" name="prompt" placeholder="John Doe on a space suit" value={form.prompt} handleChange={handleChange} isSurpriseMe handleSurpriseMe={handleSurpriseMe} />

          <div className="relative w-64 p-3 h-64 flex justiy-center items-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 ">
            {form.photo ? <img src={form.photo} alt={form.prompt} className="w-full h-full object-contain" /> : <img src={logo_icon} alt="preview" className="mx-auto object-contain opacity-40" />}

            {isGeneratingImage && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-5">
          <button type="button" onClick={generateImage} className="px-5 py-2.5 text-center text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto">
            {isGeneratingImage ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">Once you have created the image you want, share it with others in the community</p>
          <button type="submit" className="px-5 py-2.5 text-center mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto ">
            {isLoading ? "Sharing..." : "Share with the community"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
