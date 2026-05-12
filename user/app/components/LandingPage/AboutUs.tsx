export const AboutUs = () => {
  return (
    <div className="flex flex-col justify-center items-center mt-20 ">
      <h1 className="text-indigo-50 text-4xl font-semibold">About Us</h1>
      <div className="flex justify-center items-center gap-20 ">
        <img
          src="/3g.jpeg"
          alt="Unlimited Team"
          className="rounded-full w-80 "
        />
        <h2 className="text-white w-150 text-xl ">
          Unlimited Team is a group of four students from the Coding 3G class at
          Pinecone Academy. We are currently developing a platform as a demo
          team project.
        </h2>
      </div>
    </div>
  );
};
