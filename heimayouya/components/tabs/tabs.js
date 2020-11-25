Component({
    data: {},
    properties: {
        tabs: {
            type: Array,
            value: [],
        },
    },
    methods: {
        handleItemTap(e) {
            const { index } = e.currentTarget.dataset;
            // 触发 父组件中的事件 自定义
            this.triggerEvent('tabsItemChange', { index });
        },
    },
});
