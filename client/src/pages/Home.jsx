import { useEffect, useState } from "react";
import { Loader, Card, FormField } from "../components";

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) return data.map((post) => <Card key={post._id} {...post} />);

  return <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2>;
};

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [allPost, setAllPost] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);

      try {
        const response = await fetch("http://localhost:8080/api/v1/post", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          console.log(result);

          setAllPost(result.data.reverse());
        }
      } catch (error) {
        alert(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">See what others have built</h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">Browse through their imaginative and limitless possibilities of artwork generated by DALL-E AI</p>
      </div>
      <div className="mt-16">
        <FormField />
      </div>
      <div className="mt-10 ">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666E75] text-xl mb-3">
                Showing results for <span className="text-[#222328">{searchText}</span>
              </h2>
            )}
            <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">{searchText ? <RenderCards data={[]} title="No search results found" /> : <RenderCards data={allPost} title="No posts found" />}</div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
