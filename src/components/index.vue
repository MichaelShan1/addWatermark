<template>
  <div class="main-container">
    <div
      v-for="pageNumber in totalPage"
      :key="pageNumber"
      class="pdf-container"
      style="text-align: center"
      ref="pdfContainer"
    >
      <canvas
        :ref="'pdfCanvas' + pageNumber"
        style="width: 350px"
        v-lazy="lazyLoadPdf"
        :id="pageNumber"
      ></canvas>
    </div>
    <div v-if="errMessage" class="err-text">{{ errMessage }}</div>
  </div>
</template>

<script>
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      errMessage: "",
      totalPage: 0,
      waterMark: "",
      message: "Hello, world!",
      src: "https://xddt.obs.cn-east-3.myhuaweicloud.com/wxapp/zhongsu/pdf.pdf",
      pdfOBJ: "",
    };
  },
  created() {
    this.waterMark = this.$route.query.name;
    const file = this.$route.query.file;
    const first = file.slice(0, 2);
    const second = file.slice(2, 4);
    this.src = `https://xddt.obs.cn-east-3.myhuaweicloud.com/clogx6uwh0t33tenant/apps/plan/${first}/${second}/${file}`;
    console.log(this.$route, "11111111");
  },
  mounted() {
    // console.log(pdfjsWorker)
    this.viewPDF();
    // console.log(pdfjsLib,pdfjsLib.GlobalWorkerOptions.workerSrc)
  },
  beforeDestroy() {
    // Clean up the event listener when the component is destroyed
  },
  directives: {
    lazy: {
      inserted(el, binding) {
        const observer = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              console.log(el, "lazyLoaddddd");
              binding.value(el); // Call the function when visible
              observer.unobserve(el); // Stop observing after loading
            }
          });
        });
        observer.observe(el);
        el.__observer = observer;
      },
      unbind(el) {
        if (el.__observer) {
          el.__observer.disconnect(); // Clean up
        }
      },
    },
  },
  methods: {
    async lazyLoadPdf(el) {
      console.log(el, "invoke Functionnnn", el.id);
      await this.renderPage(Number(el.id), this.pdfOBJ);
      setTimeout(() => {
        this.addWaterMark(el.id);
      },200);
    },
    addWaterMark(pageNum) {
      console.log(pageNum);
      const canvas = this.$refs[`pdfCanvas${pageNum}`][0];
      const context = canvas.getContext("2d");
      const watermarkText = this.waterMark;
      const fontSize = 40;
      const opacity = 0.1; // Adjust opacity of watermark
      const angle = 45; // Angle of the watermark
      const x = canvas.width / 2; // Center X position
      const y = canvas.height / 2; // Center Y position

      // Set the watermark text style
      context.font = `${fontSize}px Arial`;
      context.fillStyle = `rgba(0, 0, 0, ${opacity})`; // Semi-transparent color
      // context.textAlign = "center";
      // context.textBaseline = "middle";

      // Save current context state
      context.save();

      // Rotate and position the watermark in the center
      context.translate(x - 550, y - 280); // Translate to center of canvas
      context.rotate((angle * Math.PI) / 180); // Rotate the watermark

      const marginX = fontSize * 5; // Horizontal margin between watermarks
      const marginY = fontSize * 2;
      // Loop to repeat the watermark across the canvas (both vertically and horizontally)
      // const margin = 100; // Margin between watermarks
      const rows = Math.ceil(canvas.width / (fontSize * 2)); // Number of rows based on font size
      const cols = Math.ceil(canvas.height / (fontSize * 4)); // Number of columns based on font size
      // Draw the watermark text
      for (let row = 0; row < rows + 2; row++) {
        for (let col = 0; col < cols + 5; col++) {
          // Draw the watermark at different positions
          const xPos = col * marginX - canvas.width / 2; // X position of watermark
          const yPos = row * marginY - canvas.height / 2; // Y position of watermark
          // Draw the watermark at this grid position
          context.fillText(watermarkText, xPos, yPos);
        }
      }
      // Restore the context state to original
      context.restore();
    },
    async viewPDF() {
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
      pdfjsLib
        .getDocument(this.src)
        .promise.then(async (pdf) => {
          console.log(pdf.numPages);
          this.totalPage = pdf.numPages;
          this.pdfOBJ = pdf;
          // const pageNum = pdf.numPages;
          // for (let i = 10; i <= 20; i++) {
          //   await this.renderPage(i, pdf);
          //   console.log("22222222");
          //   setTimeout(() => {
          //     this.addWaterMark(i);
          //   });
          // }
        })
        .catch((err) => {
          console.log(err);
          this.errMessage = err.message;
        });
    },
    async renderPage(pageNum, pdf) {
      this.$nextTick(async () => {
        const canvas = this.$refs[`pdfCanvas${pageNum}`][0];
        console.log(canvas, this.$refs.pdfCanvas1, pageNum);
        const context = canvas.getContext("2d");
        const page = await pdf.getPage(pageNum);
        console.log(page, "99999", canvas);
        const dpi = 1.5;
        // const screenWidth = window.innerWidth;
        // const screenHeight = window.innerHeight;
        // // Calculate a responsive scale based on the screen size (or container size)
        // const scale =
        //   Math.min(
        //     screenWidth / viewport.width,
        //     screenHeight / viewport.height
        //   ) // Add a small margin

        // Render the page using the calculated scale
        const viewport = page.getViewport({ scale: 1 });

        canvas.width = viewport.width * dpi;
        canvas.height = viewport.height * dpi;
        context.clearRect(0, 0, canvas.width, canvas.height);
        // Scale the context to fit the canvas size back to normal (after increasing resolution)
        context.scale(dpi, dpi);
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        // Render the page into the canvas
        page.render(renderContext);
        // this.addWaterMark(pageNum)
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main-container {
  background-color: #e6e6e6;
}
.pdf-container {
  text-align: center;
  margin-bottom: 10px;
}
.err-text {
  color: red;
  text-align: center;
}
</style>
