<template>
  <div>
    <div class="min-h-screen p-6 relative z-[2]">
        <h1 class="text-center pt-6 text-3xl sm:text-4xl font-bold text-primary">Receipt Compiler</h1>
        <h2 class="text-center pt-4 font-medium text-sm sm:text-base">Combine your receipts into a pdf file</h2>
        <div class="w-full max-w-[600px] mx-auto mt-10">
          <PhotoDrop v-if="step == 1" @input="handleFiles" />
          <div v-if="step == 2" class="h-[150px] md:h-[200px] flex items-center justify-center">
            <button class="pdf-icon" @click="generatePdf()" ref="downloadBtn">
              <img src="/pdf-icon.png" class="z-[2] relative">
              <img src="/sparkle.webp" class="sparkle z-1">
            </button>
          </div>
          <div v-if="step == 2" class="grid mx-auto max-w-[200px] gap-4 mt-4">
            <button @click="generatePdf()" class="bg-primary rounded-md text-white py-2 font-semibold border-transparent border-[1px]">Download PDF</button>
            <button @click="step = 1" class=" text-primary py-2 font-semibold border-transparent border-[1px]">Back</button>
          </div>
        </div>
      <p v-show="step == 1" class="mt-6 text-xs sm:text-sm font-medium text-center !leading-loose">*Make sure to rename your receipts with "<b>YYYY-MM-DD AMOUNT</b>" format. <br>e.g: &nbsp;&nbsp;2024-12-01 5.60.jpg</p>
    </div>

    <div v-show="step == 2" class="p-6 overflow-hidden h-screen absolute z-[1] w-full opacity-0">
      <!-- Just to load image to get image width and height -->
      <div>
        <div v-for="(group, date) in receiptGroups" class="mb-10">
          <div>
            <div class="flex mt-2">
              <!-- from the calculation stated at generatePdf(), section width is 180 and max image height is 108px -->
              <img v-for="(r, rIndex) in group.receipts" :src="r.url" :style="{maxWidth: `calc(180px / ${group.receipts.length})`, maxHeight: '108px'}" :data-receipt-id="`r_${date}_${rIndex}`">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="made-by z-[3]">Made by <a href="https://github.com/yklim9938" class="underline text-primary" target="_blank">YK Lim</a></div>
  </div>
</template>

<script setup>
import { jsPDF } from "jspdf";

useSeoMeta({
  title: 'Receipt Compiler - Combine your receipts into a pdf file',
  ogTitle: 'Receipt Compiler - Combine your receipts into a pdf file',
  description: 'Groups your receipts by date and automatically calculates the total amount.',
  ogDescription: 'Groups your receipts by date and automatically calculates the total amount.',
  ogImage: '/card.png',
  twitterCard: 'summary_large_image',
})

const step = ref(1)
watch(step, (newValue) => {
  if (newValue == 2) {
    window.document.body.classList.add('no-scroll')
  }
  else {
    window.document.body.classList.remove('no-scroll')
  }
})

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
    * width of each section = 195 - 15 = 180 ⭐
    * height of each section = 141 - 15 = 126

    - height of text line = 15 (text), 3(margin) = 18
    - max height of image = 126 - 18 = 108 ⭐
    
  */

  for (let date in receiptGroups) {
    // let maxReceiptHeight = 0
    // find max receipt height
    receiptGroups[date].receipts.forEach((receipt, receiptIndex) => {
      const receiptImage = document.querySelector(`img[data-receipt-id="r_${date}_${receiptIndex}"]`)
      /* if (receiptImage.height > maxReceiptHeight) {
        maxReceiptHeight = receiptImage.height
      } */
      receipt.originalWidth = receiptImage.width
      receipt.originalHeight = receiptImage.height
      
    })
    // receiptGroups[date].maxReceiptHeight = maxReceiptHeight
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
  let section = -1 // 0 = upper, 1 = lower. Will start at -1, the first iteration will turn it to 0
  for (let date in receiptGroups) {
    section += 1
    if (section > 1) {
      doc.addPage('a4', 'portrait')
      section = 0
    }

    doc.text(`${date}  ( RM${receiptGroups[date].total.toFixed(2)} )`, 15, drawCoordinatesY[section].total);
    let previousDrawX = 15
    receiptGroups[date].receipts.forEach((receipt, receiptIndex) => {
      const receiptImage = document.querySelector(`img[data-receipt-id="r_${date}_${receiptIndex}"]`)
      doc.addImage(receipt.url, 'jpeg', previousDrawX, drawCoordinatesY[section].receipt, receiptImage.width, receiptImage.height)
      previousDrawX += receiptImage.width
    })

  }
  doc.save("claims.pdf");
}

</script>

<style scoped>
.pdf-icon {
  width: 60px;
  opacity: 0;
}

.pdf-icon.active {
  animation: fly 0.9s ease forwards;
}

@keyframes fly {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.sparkle {
  animation: spinGrow 3s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
}

@keyframes spinGrow {
  0% {
    transform: translate(-50%, -50%) scale(4) rotate(0deg);
  }
  50% {
    transform: translate(-50%, -50%) scale(2.75) rotate(180deg);
  }
  100% {
    transform: translate(-50%, -50%) scale(4) rotate(360deg);
  }
}

.made-by {
	position: absolute;
	bottom: 16px;
	font-size: 14px;
	left: 50%;
	transform: translateX(-50%);
  display: none;
}

@media screen and (min-height: 580px) {
  .made-by {
    display: block
  }
}
</style>