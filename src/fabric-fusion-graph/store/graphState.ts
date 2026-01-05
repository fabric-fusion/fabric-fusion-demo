import { defineStore } from "pinia";
import { nanoid } from "nanoid";

interface GraphState {
  text: string;
  canvas: {
    uuid: string;
  };
}

export const useGraphStateStore = defineStore("app-graph-state", {
  state: (): GraphState => ({
    text: "app-graph",
    canvas: {
      uuid: "",
    },
  }),
  getters: {},
  actions: {
    setCanvasUUID() {
      const uuid = nanoid(10);
      this.canvas.uuid = uuid;
    },
    setText() {
      const text = Math.random().toString();
      this.text = text;
    },
  },
});
