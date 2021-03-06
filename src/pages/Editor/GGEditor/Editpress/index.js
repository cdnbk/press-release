import React from 'react';
// 引入编辑器组件
import moment from 'moment';
import { Input, Radio, Switch, DatePicker, Upload, Icon, message, Button } from 'antd';
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

import { FormattedMessage } from 'umi-plugin-react/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../Editor/index.less';
import axios from 'axios';
import { Link } from 'react-router-dom';
import router from 'umi/router';
import { ServerRoot } from '@/utils/constants';

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

const saveEditorContent = async state => {
  return await axios.post(`${ServerRoot}webInfo/update`, state, {
    headers: { 'Content-Type': 'application/json' },
  });
};

const getTypeName = async () => {
  const data = {
    pageNo: 1,
    pageSize: 10,
  };
  return await axios.post(`${ServerRoot}webInfoType/findList`, data, {
    headers: { 'Content-Type': 'application/json' },
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
    message.error('你只能上传JPG文件！');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图像必须小于2MB！');
  }
  return isJPG && isLt2M;
};

const disabledDate = current => {
  // Can not select days before today and today
  return current && current < moment().startOf('day');
};

export default class PressRelease extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    // 创建一个空的editorState作为初始值
    id: this.props.location.query.id,
    title: this.props.location.query.title,
    type: this.props.location.query.type,
    content: BraftEditor.createEditorState(this.props.location.query.content),
    imgUrl: this.props.location.query.imgUrl,
    imageUrl: this.props.location.query.imgUrl,
    topSign: this.props.location.query.topSign,
    homeSign: this.props.location.query.homeSign,
    status: this.props.location.query.status,
    infoDate: this.props.location.query.infoDate,
    sort: this.props.location.query.sort,
    loading: false,
    classify: [],
  };

  async componentDidMount() {
    // this.setState({
    //   state:
    // });
    // 假设此处从服务端获取html格式的编辑器内容
    const htmlContent = this.state.content;
    // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
    this.setState({
      content: BraftEditor.createEditorState(htmlContent),
      homeSign: this.state.homeSign,
      id: this.state.id,
      imgUrl: this.state.imgUrl,
      infoDate: this.state.infoDate,
      sort: this.state.sort,
      status: this.state.status,
      title: this.state.title,
      topSign: this.state.topSign,
      type: this.state.type,
    });

    await getTypeName().then(res => {
      this.setState({
        classify: res.data.data,
      });
    });
  }

  submitContent = async () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = this.state.content.toHTML();
    const data = {
      id: this.state.id,
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
    if (this.state.title === '') {
      message.error('请输入标题！');
      return;
    }
    if (this.state.title.length > 50) {
      message.error('请输入50字以内的标题！');
      return;
    }
    if (this.state.content.toHTML() === '<p></p>') {
      message.error('请输入内容！');
      return;
    }
    if (this.state.imgUrl === '') {
      message.error('请上传缩略图！');
      return;
    }
    if (this.state.type === '') {
      message.error('请选择分类！');
      return;
    }
    if (this.state.infoDate === '') {
      message.error('请选择时间！');
      return;
    }
    saveEditorContent(data).then(res => {
      if (res.data.code === 0) {
        router.push('/press/press-list');
      }
    });
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
    this.setState({
      type: e.target.value,
    });
  };

  handleTopSigntChange = checked => {
    this.setState({
      topSign: checked ? 1 : 0,
    });
  };

  handleHomeSigntChange = checked => {
    this.setState({
      homeSign: checked ? 1 : 0,
    });
  };

  handleStatustChange = checked => {
    this.setState({
      status: checked ? 1 : 0,
    });
  };

  handleDatePickerChange = (date, dateString) => {
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
        title={<FormattedMessage id="app.editor.editpress.title" />}
        content={<FormattedMessage id="app.editor.editpress.description" />}
      >
        <div className={styles.mycomponent}>
          <div>
            <Input
              value={this.state.title}
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
            缩略图：
            <br />
            <br />
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
            建议的尺寸（220px *150px）
          </div>
          <br />
          <div>
            分类：
            <Radio.Group
              defaultValue={this.state.type}
              buttonStyle="solid"
              onChange={this.handlehandleClassifyValueChangeChange}
            >
              {/* <Radio.Button value="402807816a8ad7fc016a8ad804480001">科技</Radio.Button>
              <Radio.Button value="402807816a900b0a016a901168830000">动画</Radio.Button> */}
              {this.state.classify.map((item, index) => {
                return <Radio.Button value={item.id}>{item.type}</Radio.Button>;
              })}
            </Radio.Group>
          </div>
          <br />
          <div>
            置顶：
            <Switch
              defaultChecked={this.state.topSign == 1 ? true : false}
              checkedChildren="是"
              unCheckedChildren="否"
              onChange={this.handleTopSigntChange}
            />
          </div>
          <br />
          <div>
            首页展示：
            <Switch
              defaultChecked={this.state.homeSign == 1 ? true : false}
              checkedChildren="是"
              unCheckedChildren="否"
              onChange={this.handleHomeSigntChange}
            />
          </div>
          <br />
          <div>
            发布状态：
            <Switch
              defaultChecked={this.state.status == 1 ? true : false}
              checkedChildren="是"
              unCheckedChildren="否"
              onChange={this.handleStatustChange}
            />
          </div>
          <br />
          <div>
            咨讯日期：
            <DatePicker
              defaultValue={moment(this.state.infoDate, 'YYYY-MM-DD')}
              // disabled
              format="YYYY-MM-DD"
              // disabledDate={disabledDate}
              onChange={this.handleDatePickerChange}
            />
          </div>
          <br />
          <div>
            <Button type="primary" onClick={this.submitContent}>
              提交
            </Button>
            <Button>
              <Link to={{ pathname: '/press/press-list' }}>取消</Link>
            </Button>
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}
