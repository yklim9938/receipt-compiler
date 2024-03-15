<template>
    <div ref="container" class="panda-container">
        <img src="/panda.png" alt="panda">
        <div class="eyelids left"></div>
        <div class="eyelids right"></div>
    </div>
</template>

<script setup>
const container = ref()
let blinkTimer = null

const randomBlinkInterval = () => {
    return 2500 + Math.random() * 6000
}

const start = () => {
    if (blinkTimer) {
        clearTimeout(blinkTimer)
    }
    blinkTimer = setTimeout(() => {
        let eyelids = container.value.querySelectorAll('.eyelids')
        eyelids.forEach(c => {
            c.classList.add('blink-once')
            setTimeout(() => {
                c.classList.remove('blink-once')
                start()
            }, 300)
        })
    }, randomBlinkInterval())
}

onMounted(() => {
    start()
})

onBeforeUnmount(() => {
    if (blinkTimer) {
        clearTimeout(blinkTimer)
    }
})
</script>

<style scoped>
.panda-container {
    margin: auto;
    width: 100%;
    max-width: 120px;
    position: relative;
}

.panda-container img {
    max-width: 100%;
}

.eyelids {
    position: absolute;
    width: 6.5%;
    height: 6.5%;
    background-color: #746c83;
    transform: scaleY(0);
    transform-origin: top;
}

.eyelids.left {
    top: 29%;
    left: 27%;
}

.eyelids.right {
    top: 30%;
    left: 52%;
}

.eyelids.blink-once {
    animation: blinkOnce 0.2s;
}

@keyframes blinkOnce {
    0% {
        transform: scaleY(0);
    }
    50% {
        transform: scaleY(1);
    }
    100% {
        transform: scaleY(0);
    }
}
</style>