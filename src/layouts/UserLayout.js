import React, { Component, Fragment } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import Link from 'umi/link';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import DocumentTitle from 'react-document-title';
import SelectLang from '@/components/SelectLang';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';
import getPageTitle from '@/utils/getPageTitle';

const links = [
  {
    key: 'help',
    title: formatMessage({ id: 'layout.user.link.help' }),
    href: '',
  },
  {
    key: 'privacy',
    title: formatMessage({ id: 'layout.user.link.privacy' }),
    href: '',
  },
  {
    key: 'terms',
    title: formatMessage({ id: 'layout.user.link.terms' }),
    href: '',
  },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2019 蚂蚁金服体验技术部出品
  </Fragment>
);

class UserLayout extends Component {
  componentDidMount() {
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, authority },
    });
  }

  render() {
    const {
      children,
      location: { pathname },
      breadcrumbNameMap,
    } = this.props;
    return (
      <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
        <div className={styles.container}>
          <div className={styles.lang}>
            <SelectLang />
          </div>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img
                    alt="logo"
                    className={styles.logo}
                    src="data:image/png;base64,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"
                  />
                  <span className={styles.title}>深视官网后台</span>
                </Link>
              </div>
              <div className={styles.desc}>深视官网后台</div>
            </div>
            {children}
          </div>
          {/* <GlobalFooter links={links} copyright={copyright} /> */}
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(({ menu: menuModel }) => ({
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
}))(UserLayout);
