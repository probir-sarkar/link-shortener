import { links } from "./store.ts";

const LinksList = () => {
  const values = links.value;
  return (
    <div className="">
      <div className="">
        {values.map((link) => (
          <div key={link.id} className="">
            <a href={link.link} className="">
              {link.link}
            </a>

            <button className="">
              Copy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinksList;
