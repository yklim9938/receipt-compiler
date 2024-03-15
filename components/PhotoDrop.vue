<template>
    <ClientOnly>
        <div class="relative h-full">
            <label :for="id" class="fd-container rounded-md" :class="{ active: dropping }" @dragenter="dragIn" @dragover="dragOver"
                @dragleave="dragOut" @drop="dragOut">
                <div class="fd-inner-container" v-if="!previewImgUrl">
                    <div class="flex items-center flex-col">
                        <div class="mt-4">
                            <Panda />
                        </div>
                        <div class="text-primary font-medium sm:text-lg mt-4 mb-2">Drop your receipts here</div>
                        <div class="text-sm font-medium">*jpg, jpeg, png</div>
                    </div>
                </div>
                <!-- <div class="fd-preview" v-if="previewImgUrl" :style="{ backgroundImage: `url(${previewImgUrl})` }"></div> -->
            </label>
            <input v-if="!disabled" type="file" style="display: none;" :id="id" :accept="accept || 'image/*'" @change="handleFiles" multiple>
            <!-- <button v-if="imageUrl" @click="remove" class="fd-remove-btn" type="button">&times;</button> -->
        </div>
    </ClientOnly>
</template>

<script setup>
const props = defineProps({
    accept: String,
    defaultImage: [String, Object],
    disabled: Boolean
})

const emit = defineEmits(['input'])
const randomId = () => {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz'.split('');
    var str = '';
    for (var i = 0; i < 4; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return `fd_${str}`;
}

const id = useId()
const dropping = ref(false)
const imageUrl = ref('')
const localFile = ref(null)


const dragIn = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dropping.value = true
}
const dragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
}
const dragOut = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dropping.value = false
    if (e.type == 'drop') {
        handleFiles(e)
    }
}
const getLocalImage = () => {
    if (!localFile.value) return ''
    return URL.createObjectURL(localFile.value)
}
const handleFiles = (e) => {
    let t = e.dataTransfer ? e.dataTransfer : e.target
    if (t.files.length < 1) return

/*     localFile.value = t.files[0]
    imageUrl.value = getLocalImage()

    let files = []
    files.push({
        id: randomId(),
        file: t.files[0]
    }) */
    emit('input', t.files)
}
const remove = (e) => {
    e.stopPropagation()
    localFile.value = null
    imageUrl.value = ''
    emit('input', [])
}

onBeforeMount(() => {
    if (props.defaultImage) {
        imageUrl.value = props.defaultImage
    }
})

const previewImgUrl = computed(() => {
    return imageUrl.value || props.defaultImage || ''
})

</script>

<style scoped>
.fd-container {
    width: 100%;
    border-radius: 4px;
    padding: 1rem;
    cursor: pointer;
    position: relative;
    min-height: 150px;
    display:block;
    border: 1px solid var(--line);
}

@media screen and (min-width: 768px) {
	.fd-container {
        min-height: 200px;
    }
}

.fd-container .fd-inner-container {
    width: 100%;
    height: 100%;
    padding: 1.5rem;
    border: 1px dashed var(--line);
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    pointer-events: none;
}

.fd-container.active {
    background: #a1dbff88;
    /* border: 1px solid var(--primary); */
}

.fd-container.active .fd-inner-container {
    /* border: 1px dashed var(--primary); */
}

.fd-drop-icon {
    width: 30px;
    height: 30px;
}

.fd-preview {
    width: 100%;
    height: 100%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

.fd-remove-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    color: #fff;
    background-color: #0000005F;
    border-radius: 50%;
    font-size: 30px;
    line-height: 1;
    width: 32px;
    height: 32px;
    border: none;
    line-height: 0
}
</style>