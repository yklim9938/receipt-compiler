<template>
  <div>
    <div v-if="step == 1" class="min-h-screen p-6">
        <h1 class="text-center pt-6 text-3xl sm:text-4xl font-bold text-primary">Receipt Compiler</h1>
        <div class="w-full max-w-[600px] mx-auto mt-10">
          <PhotoDrop @input="handleFiles" />
        </div>
      <p class="mt-6 text-xs sm:text-sm font-medium text-center !leading-loose">*Make sure to rename your receipts with "<b>YYYY-MM-DD AMOUNT</b>" format. <br>e.g: &nbsp;&nbsp;2024-12-01 5.60.jpg</p>
    </div>
    <div v-if="step == 2" class="p-6 overflow-hidden h-screen relative">
      <div class="opacity-0">
        <div v-for="(group, date) in receiptGroups" class="mb-10">
          <div>
            <div class="inline-block bg-blue-300 font-medium py-1 px-2">
              <span>{{ date }}</span>
              <span class="ml-3 text-lg">RM {{ group.total.toFixed(2) }}</span>
            </div>
            <div class="flex mt-2">
              <img v-for="(r, rIndex) in group.receipts" :src="r.url" :style="{maxWidth: `${100 / group.receipts.length}%`, height: '380px'}" :data-receipt-id="`r_${date}_${rIndex}`">
            </div>
          </div>
        </div>
      </div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div class="h-[300px] relative flex flex-col justify-end">
          <button class="pdf-icon" @click="generatePdf()" ref="downloadBtn">
            <img src="/pdf-icon.png">
          </button>
          <div>
            <Panda />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { jsPDF } from "jspdf";

const step = ref(1)

const getReceiptDateFromFileName = (imageFileName) => {
  const dateRegex = /\d{4}-\d{2}-\d{2}/
  const extractedDate = dateRegex.exec(imageFileName)
  return extractedDate ? extractedDate[0] : null
}

const getReceiptAmountFromFileName = (imageFileName) => {
  const amountRegex = /\s[\d]+\.[\d]{2}/
  const extracedAmount = amountRegex.exec(imageFileName)
  return extracedAmount ? parseFloat(extracedAmount[0]) : null
}

const groupImagesByDate = (imageFiles) => {
  let dates = {}
  let filenameFormatError = false
  for (let i = 0; i < imageFiles.length; i++) {
    let receiptDate = getReceiptDateFromFileName(imageFiles[i].name)
    let receiptAmount = getReceiptAmountFromFileName(imageFiles[i].name)
    if (!receiptDate || !receiptAmount) {
      filenameFormatError = true
      break;
    }
    
    if (dates[receiptDate]) {
      dates[receiptDate].receipts.push({
        url: URL.createObjectURL(imageFiles[i]),
        amount: receiptAmount
      })
      dates[receiptDate].total += receiptAmount
      if (dates[receiptDate].total >= 15) {
        dates[receiptDate].total = 15
      }
    }
    else {
      dates[receiptDate] = {
        receipts: [{
          url: URL.createObjectURL(imageFiles[i]),
          amount: receiptAmount
        }],
        total: receiptAmount
      }
    }
  }

  if (filenameFormatError) {
    return { status: false }
  }

  return { status: true, groups: dates }
}

let receiptGroups = {}
const downloadBtn = ref()
const handleFiles = (e) => {
  const imageGroups = groupImagesByDate(e)
  if (!imageGroups.status) {
    alert('Please rename all images with "YYYY-MM-DD AMOUNT" format')
    return
  }

  receiptGroups = imageGroups.groups
  step.value = 2
  setTimeout(() => {
    downloadBtn.value.classList.add('active')
  }, 150);
}

const generatePdf = () => {
  if (Object.keys(receiptGroups).length == 0) return;
  /* 
    - a4 size in mm = 210x297
    - page padding = 15mm
    - min max coordiantes of drawable area: x_min = 15, x_max = 195, y_min = 15, y_max = 282
    - break drawable area into upper and lower section, mid point of y = 297 / 2 = 148.5
    - add 15 gap between upper and lower section, each section - 7.5
    - upper drawable area:
        x_min = 15, x_max = 195
        y_min = 15, y_max = 148.5 - 7.5 = 141
    - lower drawable area:
        x_min = 1.5, x_max = 195
        y_min = 148.5 + 7.5 = 156, y_max = 282

    * Therefore:
    * width of each section = 195 - 15 = 180
    * height of each section = 141 - 15 = 126

    - height of text line = 15 (text), 3(margin) = 18
    - max height of image = 126 - 18 = 108
    
  */

  for (let date in receiptGroups) {
    let maxReceiptHeight = 0
    // find max receipt height
    receiptGroups[date].receipts.forEach((receipt, receiptIndex) => {
      const receiptImage = document.querySelector(`img[data-receipt-id="r_${date}_${receiptIndex}"]`)
      if (receiptImage.height > maxReceiptHeight) {
        maxReceiptHeight = receiptImage.height
      }
      receipt.originalWidth = receiptImage.width
      receipt.originalHeight = receiptImage.height
      
    })
    receiptGroups[date].maxReceiptHeight = maxReceiptHeight
  }

  const doc = new jsPDF();
  const drawCoordinatesY = [
    {
      total: 15,
      receipt: 18
    }, {
      total: 156,
      receipt: 159
    }
  ]
  let section = 0 // 0 = upper, 1 = lower
  for (let date in receiptGroups) {
    doc.text(`${date}  ( RM${receiptGroups[date].total.toFixed(2)} )`, 15, drawCoordinatesY[section].total);
    let drawWidth = 100 / receiptGroups[date].receipts.length * 180 // 180 is width of each section

    let previousDrawX = 15
    receiptGroups[date].receipts.forEach((r, i) => {
      // calculate draw width and height
      const imageRatio = r.originalWidth / r.originalHeight
      let drawHeight = drawWidth / imageRatio
      if (drawHeight > 108) { // 108 is max image height
        drawHeight = 108
        drawWidth = imageRatio * drawHeight
      }
      if (i > 0) {
        previousDrawX += drawWidth
      }
      doc.addImage(r.url, 'jpeg', previousDrawX, drawCoordinatesY[section].receipt, drawWidth, drawHeight)
    })

    section += 1
    if (section > 1) {
      doc.addPage('a4', 'portrait')
      section = 0
    }
  }
  doc.save("claims.pdf");
}

</script>

<style scoped>
.pdf-icon {
  position: absolute;
  width: 100px;
  left: 50%;
  bottom: 30px;
  transform: translateX(-50%);
  opacity: 0;
}

.pdf-icon.active {
  animation: fly 0.6s ease forwards;
}

@keyframes fly {
  0% {
    opacity: 0;
    transform: translateX(-50%) scale(0.3);
    bottom: 30px;
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) scale(1);
    bottom: 170px;
  }
}
</style>