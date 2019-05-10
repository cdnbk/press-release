import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Table,
  Tag,
} from 'antd';
import { async } from 'q';
import axios from 'axios';

const { Column, ColumnGroup } = Table;

const initPressData = data => {
  return axios.post('/api/webInfo/findList', data, {
    headers: { 'Content-Type': 'application/json' },
  });
};
const initdata = { pageNo: 1, pageSize: 10 };

const testdata = [
  {
    id: '402807816a8c37b7016a8c37be770001',
    title: '111111111',
    type: '402807816a8ad7fc016a8ad804480001',
    typeName: '新闻资讯-1',
    content: '11111111',
    imgUrl: null,
    topSign: 1,
    homeSign: null,
    status: 1,
    infoDate: '2019-05-06T05:00:00.000+0000',
    sort: null,
  },
  {
    id: '402807816a8c5082016a8c5088780001',
    title: '111111111',
    type: '402807816a8ad7fc016a8ad804480001',
    typeName: '新闻资讯-1',
    content: '11111111',
    imgUrl: null,
    topSign: 1,
    homeSign: null,
    status: 1,
    infoDate: '2019-05-06T05:00:00.000+0000',
    sort: null,
  },
];

const title = () => '新闻列表';

export default class PressList extends React.Component {
  state = {
    data: [
      {
        id: '402807816a8c5082016a8c5088780001',
        title: '111111111',
        type: '402807816a8ad7fc016a8ad804480001',
        typeName: '新闻资讯-1',
        content: '11111111',
        imgUrl: null,
        topSign: 1,
        homeSign: null,
        status: 1,
        infoDate: '2019-05-06T05:00:00.000+0000',
        sort: null,
      },
    ],
  };

  async componentDidMount() {
    // 假设此处从服务端获取html格式的编辑器内容
    // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
    // axios
    // .post('/api/webInfo/findList', initdata, { headers: { 'Content-Type': 'application/json' } })
    // .then(res => {
    //     console.log(res.data);
    //     this.setState({
    //         data: res.data.data
    //     })
    //     console.log(this.state.data);
    // });
    initPressData(initdata).then(res => {
      console.log(res.data);
      this.setState({
        data: res.data.data,
      });
    });
  }

  render() {
    return (
      <div style={{ background: '#fff', padding: '40px' }}>
        <h2>新闻列表</h2>
        <Table dataSource={this.state.data} title={title}>
          <Column title="标题" dataIndex="title" key="title" />
          <Column title="咨讯日期" dataIndex="infoDate" key="infoDate" />
          <Column title="分类" dataIndex="type" key="type" />
          <Column title="id" dataIndex="id" key="id" />
          {/* <Column
            title="Address"
            dataIndex="address"
            key="address"
            />
            <Column
            title="Tags"
            dataIndex="tags"
            key="tags"
            render={tags => (
                <span>
                {tags.map(tag => <Tag color="blue" key={tag}>{tag}</Tag>)}
                </span>
            )}
            /> */}
          <Column
            title="Action"
            key="action"
            render={(text, record) => (
              <span>
                <a href="javascript:;">Invite {record.lastName}</a>
                <Divider type="vertical" />
                <a href="javascript:;">Delete</a>
              </span>
            )}
          />
        </Table>
      </div>
    );
  }
}
