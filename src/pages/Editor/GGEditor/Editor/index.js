import React from 'react';
// 引入编辑器组件
import moment from 'moment';
import { Input, Radio, Switch, DatePicker, Upload, Icon, message, Button } from 'antd';
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

import { FormattedMessage } from 'umi-plugin-react/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './index.less';
import axios from 'axios';

const { RangePicker } = DatePicker;
const fetchEditorContent = state => {
  // axios
  // .post('/api/webInfo/add', state, { headers: { 'Content-Type': 'application/json' } })
  // .then(res => {
  // console.log(res);
  // });
  setTimeout(() => {
    return '<h1>hello world</h1>';
  }, 1000);
};

const saveEditorContent = state => {
  axios
    .post('/api/webInfo/add', state, { headers: { 'Content-Type': 'application/json' } })
    .then(res => {
      console.log(res);
    });
};

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = file => {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
};

const disabledDate = current => {
  // Can not select days before today and today
  return current && current < moment().startOf('day');
};

export default class PressRelease extends React.Component {
  state = {
    // 创建一个空的editorState作为初始值
    title: '',
    type: '',
    content: BraftEditor.createEditorState(null),
    imgUrl: '',
    topSign: 0,
    homeSign: 0,
    status: 0,
    infoDate: '',
    sort: 1,
    loading: false,
  };

  async componentDidMount() {
    // 假设此处从服务端获取html格式的编辑器内容
    const htmlContent = await fetchEditorContent(this.state);
    // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
    this.setState({
      content: BraftEditor.createEditorState(htmlContent),
    });
  }

  submitContent = async () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = this.state.content.toHTML();
    const data = {
      title: this.state.title,
      type: this.state.type,
      content: htmlContent,
      imgUrl: this.state.imgUrl,
      topSign: this.state.topSign,
      homeSign: this.state.homeSign,
      status: this.state.status,
      infoDate: this.state.infoDate,
      sort: this.state.sort,
    };
    console.log(data);
    const result = await saveEditorContent(data);
  };

  handleImgUrlChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      //   this.setState({
      //       imgUrl: imageUrl
      //   });
      //   console.log(this.state.imgUrl);
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          imgUrl: imageUrl,
          loading: false,
        })
      );
    }
  };

  handleTitleChange = e => {
    console.log(e.target.value);
    this.setState({
      title: e.target.value,
    });
  };

  handleEditorChange = editorState => {
    // console.log(editorState.toHTML())
    this.setState({
      content: editorState,
    });
  };

  handlehandleClassifyValueChangeChange = e => {
    console.log('radio1 checked', e.target.value);
    this.setState({
      type: e.target.value,
    });
  };

  handleTopSigntChange = checked => {
    this.setState({
      topSign: checked ? 1 : 0,
    });
    console.log(`topSign to ${this.state.topSign}`);
  };

  handleHomeSigntChange = checked => {
    this.setState({
      homeSign: checked ? 1 : 0,
    });
    console.log(`homeSign to ${this.state.homeSign}`);
  };

  handleStatustChange = checked => {
    this.setState({
      status: checked ? 1 : 0,
    });
    console.log(`status to ${this.state.status}`);
  };

  handleDatePickerChange = (date, dateString) => {
    console.log(date, dateString);
    this.setState({
      infoDate: dateString,
    });
  };

  render() {
    const { content: editorState } = this.state;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    return (
      <PageHeaderWrapper
        title={<FormattedMessage id="app.editor.editor.title" />}
        content={<FormattedMessage id="app.editor.editor.description" />}
      >
        <div className={styles.mycomponent}>
          <div>
            <Input
              size="large"
              placeholder="请输入标题（建议30字以内）"
              onChange={this.handleTitleChange}
            />
          </div>
          <BraftEditor
            value={editorState}
            onChange={this.handleEditorChange}
            onSave={this.submitContent}
          />
          <div>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={this.handleImgUrlChange}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
            </Upload>
          </div>
          <br />
          <div>
            分类：
            <Radio.Group
              defaultValue="a"
              buttonStyle="solid"
              onChange={this.handlehandleClassifyValueChangeChange}
            >
              <Radio.Button value="402807816a8ad7fc016a8ad804480001">科技</Radio.Button>
              <Radio.Button value="402807816a900b0a016a901168830000">动画</Radio.Button>
            </Radio.Group>
          </div>
          <br />
          <div>
            置顶：
            <Switch
              checkedChildren="是"
              unCheckedChildren="否"
              onChange={this.handleTopSigntChange}
            />
          </div>
          <br />
          <div>
            首页展示：
            <Switch
              checkedChildren="是"
              unCheckedChildren="否"
              onChange={this.handleHomeSigntChange}
            />
          </div>
          <br />
          <div>
            发布状态：
            <Switch
              checkedChildren="是"
              unCheckedChildren="否"
              onChange={this.handleStatustChange}
            />
          </div>
          <br />
          <div>
            咨讯日期：
            <DatePicker
              format="YYYY-MM-DD"
              disabledDate={disabledDate}
              onChange={this.handleDatePickerChange}
            />
          </div>
          <br />
          <div>
            <Button type="primary" onClick={this.submitContent}>
              提交
            </Button>
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}
