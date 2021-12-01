import { shallowMount } from "@vue/test-utils";
import Card from "@/components/Card.vue";

describe("Card.vue", () => {
  const CSS_FLIP_TRANSITION = "flip-vertical";
  const img = {
    id: "0",
    author: "Alejandro Escamilla",
    width: 5616,
    height: 3744,
    url: "https://unsplash.com/photos/yC-Yzbqy7PY",
    download_url: "https://picsum.photos/id/0/5616/3744",
  };

  it("check that image props are rendered when passed", () => {
    const wrapper = shallowMount(Card, {
      props: { img },
    });
    const authorSpan = wrapper.find("span");
    expect(authorSpan.text()).toContain(img.author);
    expect(wrapper.find("a").text()).toMatch(img.url);
  });

  it("check initial state", () => {
    const wrapper = shallowMount(Card, {
      props: { img },
    });
    expect(wrapper.vm.pressed).toBe(false);
    expect(wrapper.find(".card-container").classes(CSS_FLIP_TRANSITION)).toBe(
      false
    );
  });

  it("check that the flip-transition class is added and removed when clicking the card", async () => {
    const wrapper = shallowMount(Card, {
      props: { img },
    });
    const card = wrapper.find(".card-container");
    await card.trigger("click");
    expect(wrapper.vm.pressed).toBe(true);
    expect(card.classes(CSS_FLIP_TRANSITION)).toBe(true);
    await card.trigger("click");
    expect(card.classes(CSS_FLIP_TRANSITION)).toBe(false);
    expect(wrapper.vm.pressed).toBe(false);
  });
});
