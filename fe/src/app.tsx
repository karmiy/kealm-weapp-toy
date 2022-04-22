import { Component } from 'react';
import { RecoilRoot } from 'recoil';
import 'windi.css';
// import './custom-theme.scss';
import './app.scss';

// PATCH: 为 recoil 包中判断 Window 打补丁，解决小程序报错
if (!global.Window) {
    Object.defineProperty(global, 'Window', {
        value: window.constructor,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}

class App extends Component {
    componentDidMount() {
        //
    }

    componentDidShow() {
        //
    }

    componentDidHide() {
        //
    }

    componentDidCatchError() {
        //
    }

    // this.props.children 是将要会渲染的页面
    render() {
        return <RecoilRoot>{this.props.children}</RecoilRoot>;
    }
}

export default App;
