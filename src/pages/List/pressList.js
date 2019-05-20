import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Link } from 'react-router-dom';
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
  Popconfirm,
} from 'antd';
import { async } from 'q';
import axios from 'axios';
import { ServerRoot } from '@/utils/constants';

const { Column, ColumnGroup } = Table;

const initPressData = data => {
  return axios.post(`${ServerRoot}webInfo/findList`, data, {
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
    page: 1,
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
      this.setState({
        data: res.data.data,
        count: res.data.count,
      });
    });
  }

  pressListChangePage = page => {
    this.setState({
      page: page,
    });
    let params = {
      pageNo: page,
      pageSize: 10,
    };
    initPressData(params).then(res => {
      this.setState({
        data: res.data.data,
        count: res.data.count,
      });
    });
  };

  render() {
    const deleteInfo = id => {
      const deleteData = {
        ids: [id],
      };
      const pageData = {
        pageNo: this.state.page,
        pageSize: 10,
      };
      if (this.state.data.length == 1 && this.state.page != 1) {
        pageData.pageNo -= 1;
      }
      // this.pressListChangePage(this.state.page);
      axios
        .post(`${ServerRoot}webInfo/delete`, deleteData, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then(res => {
          if (res.data.code === 0) {
            message.success('删除成功');
          }
          initPressData(pageData).then(rep => {
            this.setState({
              data: rep.data.data,
              count: rep.data.count,
            });
          });
          // const dataSource = [...this.state.data];
          // this.setState({ data: dataSource.filter(item => item.id !== id) });
        });
    };

    const cancelDeleteInfo = e => {
      message.error('取消删除');
    };
    return (
      <div style={{ background: '#fff', padding: '40px' }}>
        <h2>新闻列表</h2>
        <Table
          dataSource={this.state.data}
          pagination={{
            pageSize: 10,
            total: this.state.count,
            showTotal: total => `总共 ${total} 条`,
            onChange: this.pressListChangePage,
          }}
          title={title}
        >
          <Column title="标题" dataIndex="title" key="title" />
          <Column title="分类" dataIndex="typeName" key="typeName" />
          <Column title="咨讯日期" dataIndex="infoDate" key="infoDate" />
          <Column
            title="是否置顶"
            key="置顶"
            render={(text, record) => <span>{record.topSign == 1 ? '是' : '否'}</span>}
          />
          <Column
            title="是否发布"
            key="发布"
            render={(text, record) => <span>{record.status == 1 ? '是' : '否'}</span>}
          />
          {/* <Column title="id" dataIndex="id" key="id" /> */}
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
            title="操作"
            key="action"
            render={(text, record) => (
              <span>
                <Link to={{ pathname: '/press/Editpress', query: record }}>编 辑</Link>
                {/* <a href={'#/press/Editpress/'}>编辑</a> */}
                <Divider type="vertical" />
                <Popconfirm
                  title="确实要删除此资讯吗?"
                  onConfirm={() => deleteInfo(record.id)}
                  onCancel={cancelDeleteInfo}
                  okText="是"
                  cancelText="否"
                >
                  <Button type="link">删除</Button>
                </Popconfirm>
              </span>
            )}
          />
        </Table>
      </div>
    );
  }
}
