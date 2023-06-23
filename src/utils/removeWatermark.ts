//去除Suerly vue 水印,父组件用onMounted  子组件用onUpdated

export const removeWatermark = () => {
  removeWatermarkOut();
  removeWatermarkInner();
};

const removeWatermarkOut = () => {
  const doc: HTMLCollectionOf<Element> = document.getElementsByClassName(
    "surely-table surely-table-support-sticky surely-table-bordered surely-table-default surely-table-no-ping surely-table-has-animate"
  );
  for (let i = 0; i < doc.length; i++) {
    for (let j = 0; j < doc.item(i).children.length; j++) {
      if (doc.item(i).children.item(j).innerHTML == "Unlicensed Product") {
        doc.item(i).children.item(j).innerHTML = "";
        return;
      }
    }
  }
};
const removeWatermarkInner = () => {
  const doc: HTMLCollectionOf<Element> =
    document.getElementsByClassName("surely-table-body");
  for (let i = 0; i < doc.length; i++) {
    for (let j = 0; j < doc.item(i).children.length; j++) {
      if (doc.item(i).children.item(j).innerHTML == "Powered by Surely Vue") {
        doc.item(i).children.item(j).innerHTML = "";
        return;
      }
    }
  }
};
