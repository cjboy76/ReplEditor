import { useHead, useSeoMeta } from "@vueuse/head";

const useHeader = () => {
  useHead({
    title: "ReplEditor",
    meta: [
      {
        name: "author",
        content: "@cjboy76",
      },
      {
        name: "description",
        content: "A code editor based on VueJS.",
      },
    ],
  });

  useSeoMeta({
    title: "ReplEditor",
    description: "A code editor based on VueJS.",
    ogDescription: "A code editor based on VueJS.",
    ogTitle: "ReplEditor",
    ogImage:
      "https://github.com/cjboy76/ReplEditor/blob/main/doc/readmeCover.png",
    twitterCard: "summary_large_image",
    twitterImage:
      "https://github.com/cjboy76/ReplEditor/blob/main/doc/readmeCover.png",
    twitterTitle: "ReplEditor",
    twitterDescription: "A code editor based on VueJS.",
  });
};
export { useHeader };
