// import Mock from 'mockjs'

export default [
  // {
  //   // eslint-disable-next-line no-useless-concat
  //   url: RegExp('/isunique' + '.*'),
  //   type: 'get',
  //   response: () => {
  //     const res = Mock.mock(Mock.Random.boolean())
  //     return res
  //   },
  // },
  // {
  //   // eslint-disable-next-line no-useless-concat
  //   url: RegExp('/goapi/admin/courses/navs/' + '.*'),
  //   type: 'get',
  //   response: (obj: any) => {
  //     console.log('obj', obj)
  //     const res = Mock.mock({
  //       course: {
  //         title: '#101课程',
  //         id: '1',
  //       },
  //       'sections|1-5': [
  //         {
  //           'id|+1': /id[1-9][1-9][a-z]/,
  //           type: Mock.Random.pick(['Video', 'Notion', 'Quiz', 'Review', 'Reward']),
  //           logo: 'string',
  //           title: /随堂章节[1-9][1-9][a-z]/,
  //           content: ['1234'],
  //         },
  //       ],
  //     })
  //     return res
  //   },
  // },
  // {
  //   url: '/goapi/organizations/current-user',
  //   type: 'get',
  //   response: () => {
  //     const res = Mock.mock({
  //       'orgs|5-10': [
  //         {
  //           'id|+1': /id[1-9][1-9][a-z]/,
  //           bgImage: 'https://deschool.s3.amazonaws.com/Avatar/%E5%A4%B4%E5%9B%BE.jpg',
  //           logo: 'string',
  //           name: /DAO[1-9][1-9][a-z]/,
  //           tags: [
  //             {
  //               'id|+1': '0',
  //               name: /公会[1-9][1-9][a-z]/,
  //             },
  //           ],
  //         },
  //       ],
  //     })
  //     return res.orgs
  //   },
  // },
  // GetToken
  // {
  //   url: "/auth/oauth/token",
  //   type: "post",
  //   response: (option: any) => {
  //     const $name = JSON.parse(option.body).name;
  //     if ($name) {
  //       return Mock.mock({
  //         code: 200,
  //         message: "成功",
  //         data: {
  //           name: "testToken",
  //         },
  //       });
  //     } else {
  //       return Mock.mock({
  //         code: 400,
  //         message: "未提交参数",
  //       });
  //     }
  //   },
  // },
]
