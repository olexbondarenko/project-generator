<template>
    <component
        :is="tag"
        v-on="$listeners"
        :type="setType"
        :class="buttonClasses"
        class="everyday-winner-2023-button"
    >
        <span class="everyday-winner-2023-button__text">
            <slot></slot>
        </span>
    </component>
</template>

<script>
    import {
        computed, defineComponent, toRefs, unref,
    } from '@nuxtjs/composition-api';
    import {defaultSizeType} from 'components/uiKit/size.constants';
    import {themeType} from 'components/uiKit/theme.constants';

    export default defineComponent({
        name: 'EverydayWinner2023Button',
        props: {
            tag: {
                type: String,
                default: 'button',
            },
            size: {
                type: String,
                default: defaultSizeType,
            },
            theme: {
                type: String,
                default: themeType.default,
            },
            blinking: {
                type: Boolean,
                default: false,
            },
        },
        setup(props) {
            const {
                tag, size, theme, blinking,
            } = toRefs(props);

            const buttonClasses = computed(() => ({
                [`everyday-winner-2023-button--size-${unref(size)}`]: Boolean(unref(size)),
                [`everyday-winner-2023-button--theme-${unref(theme)}`]: Boolean(unref(theme)),
                'everyday-winner-2023-button--blink': Boolean(unref(blinking)),
            }));

            const setType = computed(() => (unref(tag) === 'button' ? 'button' : ''));

            return {
                buttonClasses,
                setType,
            };
        },
    });
</script>

<style scoped lang="scss">
@import 'components/promotions/everydayWinner2023/components/styles/everydayWinner2023Button/component';
</style>
