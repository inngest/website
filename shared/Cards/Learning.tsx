import ArrowRight from "../Icons/ArrowRight";
import {
  IconDocs,
  IconPatterns,
  IconGuide,
  IconTutorial,
  IconBlog,
} from "../Icons/duotone";
import Card from "src/components/Card";

function getType(type) {
  switch (type) {
    case "GUIDE":
      return {
        label: "Guide",
        icon: IconGuide,
      };
    case "TUTORIAL":
      return {
        label: "Tutorial",
        icon: IconTutorial,
      };
    case "PATTERN":
      return {
        label: "Pattern",
        icon: IconPatterns,
      };
    case "DOCS":
      return {
        label: "Docs",
        icon: IconDocs,
      };
    case "BLOG":
      return {
        label: "Blog",
        icon: IconBlog,
      };
    default:
      return {
        label: "Docs",
        icon: IconDocs,
      };
  }
}

export default function Learning({ type, href, title, description }) {
  const learningType = getType(type.toUpperCase());

  return (
    <a href={href} className="group flex rounded-lg text-basis transition-all">
      <Card variant="hover" className="flex p-4 pt-4 xl:p-6 xl:pt-5">
        <span className="flex items-center gap-1 text-sm font-semibold">
          <learningType.icon size={24} color="matcha" /> {type}
        </span>
        <h4 className="mb-1.5 mt-2 text-lg lg:mb-2.5 lg:text-xl">{title}</h4>
        <p className="flex-grow text-sm leading-6">{description}</p>

        <span className="transition-color mt-4 flex items-center  text-sm font-medium text-[#CBB26A] group-hover:underline">
          Read {learningType.label.toLowerCase()}{" "}
          <ArrowRight className="ml-1 transition-transform group-hover:translate-x-2" />
        </span>
      </Card>
    </a>
  );
}
