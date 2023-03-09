import { useEffect, useState } from 'react'
import Form from 'antd/es/form'
import Button from 'antd/es/button'
// import Radio from 'antd/es/radio'
import Checkbox from 'antd/es/checkbox'
import Select from 'antd/es/select'
import Space from 'antd/es/space'
import message from 'antd/es/message'
import Modal from 'antd/es/modal'
import { useTranslation } from 'react-i18next'
import Tooltip from 'antd/es/tooltip'
import type { q11eParam } from '~/api/booth/booth'
import { getQ11e, putQ11e } from '~/api/booth/booth'
import Suggest from './suggested'
import { randomConfetti } from '../resume/utils/confetti'
import { useAccount } from '~/account'

const InterestTag = [
  {
    value: 'defi',
    label: 'DeFi',
  },
  {
    value: 'web3',
    label: 'Web3',
  },
  {
    value: 'dao',
    label: 'DAO',
  },
  {
    value: 'nft',
    label: 'NFT',
  },
  {
    value: 'infra',
    label: 'Infra',
  },
  {
    value: 'gamefi',
    label: 'GameFi',
  },
  {
    value: 'socialfi',
    label: 'SocialFi',
  },
  {
    value: 'protocol',
    label: 'Protocol',
  },
  {
    value: 'dex',
    label: 'DEX',
  },
  {
    value: 'cex',
    label: 'CEX',
  },
  {
    value: 'tokenomics',
    label: 'Tokenomics',
  },
  {
    value: 'research',
    label: 'Research',
  },
  {
    value: 'talent acquisition',
    label: 'Talent Acquisition',
  },
  {
    value: 'development',
    label: 'Development',
  },
]

const MatchConfig = () => {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [fired, setFired] = useState(false)
  const user = useAccount()

  const loadInitialValues = async () => {
    if (!user) {
      return
    }
    try {
      const result = await getQ11e(user.id)
      if (!result) {
        return
      }
      let fields: Record<string, any> = {}
      Object.entries(result).forEach(([key, value]) => {
        fields[`${key.toLowerCase()}`] = value
      })
      form.setFieldsValue(fields)
    } catch (err) {
      /* empty */
    }
  }

  useEffect(() => {
    setLoading(false)
    loadInitialValues()
  }, [])

  const handleSubmmit = async () => {
    try {
      setLoading(true)
      // 判断表单是否通过验证
      const validResult = await form.validateFields()
      if (validResult?.errors) {
        return false
      }
      if (!user) {
        setLoading(false)
        message.error('Not log in yet. Cannot get address from both Lens and DeSchool, please login and try again')
        return false
      }

      // 最后请求
      const values = await form.getFieldsValue()
      const params: q11eParam = {
        userId: user.id,
        goals: values.goals,
        interests: values.interests,
        pref1: '[]', // values.pref1,
        pref2: '[]', // values.pref2,
        pref3: '[]', // values.pref3,
        mbti: values.mbti,
      }

      await putQ11e(params)
      setLoading(false)
      setOpen(true)

      if (!fired) {
        randomConfetti()
        setFired(true)
      }
      return true
    } catch (error) {
      console.log(error)
      setLoading(false)
      return false
    }
  }

  return (
    <div className="flex flex-col">
      <Form
        form={form}
        name="match"
        initialValues={{ remember: true }}
        layout="vertical"
        autoComplete="off"
        onFinish={handleSubmmit}
        className="fcs-center space-y-10 font-ArchivoNarrow"
      >
        {/* 目标板块 */}
        <Form.Item
          name="goals"
          label={<div className="py-3 text-xl font-bold font-ArchivoNarrow">{t('matchpage.goals')}</div>}
          colon={false}
          rules={[{ required: true, message: 'Please select your goals!' }]}
        >
          <Checkbox.Group>
            <Space direction="vertical">
              {[
                {
                  short: 'to find partners',
                  desc: 'I want to have my partners for web3 start-up, DAO, hackathon, etc',
                  tip: 'This will make the algorithm tend to recommend you people with the same personality and complementary abilities as you',
                },
                {
                  short: 'to find similar friends',
                  desc: 'I want to find similar friends',
                  tip: 'This will make the algorithm tend to recommend people with the same personality or ability as you',
                },
                {
                  short: 'to look around',
                  desc: 'I just want to look around',
                  tip: 'This will make the algorithm tend to recommend interesting people to you at random',
                },
              ].map(item => (
                <Tooltip key={item.tip} title={item.tip}>
                  <Checkbox value={item.short} style={{ lineHeight: '32px', fontSize: '1rem' }} className="font-ArchivoNarrow text-xl">
                    {item.desc}
                  </Checkbox>
                </Tooltip>
              ))}
            </Space>
          </Checkbox.Group>
        </Form.Item>

        {/* 感兴趣的领域板块 */}
        <Form.Item
          name="interests"
          label={<div className="py-3 text-xl font-bold font-ArchivoNarrow">{t('matchpage.fields')}</div>}
          colon={false}
          className="w-full"
          rules={[{ required: true, message: 'Please tell us at least one your fields of interests!' }]}
          style={{ marginTop: 0 }}
        >
          <Select mode="tags" options={InterestTag} />
        </Form.Item>

        {/* 偏好板块 */}
        {/* <Form.Item
          name="pref1"
          label={
            <div>
              <div className="py-3  text-xl font-bold">{t('matchpage.belief')}</div>
              <b>Speed vs Stability</b>
            </div>
          }
          colon={false}
          rules={[{ required: true, message: 'Please select your preference!' }]}
        >
          <Radio.Group>
            <Space direction="vertical">
              <Radio value="speed">I prefer to be able to make progress and achieve success at a rapid speed</Radio>
              <Radio value="stability">
                I hope that I can work in this industry for a long time, accumulate continuously, and wait for a successful day
              </Radio>
              <Radio value="balanced-speed">I take both and lean toward a balance</Radio>
            </Space>
          </Radio.Group>
        </Form.Item> */}

        {/* <Form.Item
          name="pref2"
          label={<b>Scale vs Flexibility</b>}
          colon={false}
          rules={[{ required: true, message: 'Please select your preference!' }]}
        >
          <Radio.Group>
            <Space direction="vertical">
              <Radio value="scale">
                I like to do things in a large team, for example, more than 20 people, each with their own division of labor, can focus on
                their own area to do things
              </Radio>
              <Radio value="flexibility">
                I like to work in an elite team, maybe only 3 to 5 people, which is more flexible, and one person can also take on multiple
                job responsibilities
              </Radio>
              <Radio value="balanced-scale">I take both and lean toward a balance</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="pref3"
          label={<b>Efficiency vs Consensus</b>}
          colon={false}
          rules={[{ required: true, message: 'Please select your preference!' }]}
        >
          <Radio.Group>
            <Space direction="vertical">
              <Radio value="efficiency">I prefer more efficient teams, more output, more visible progress</Radio>
              <Radio value="consensus">
                I prefer a high-consensus team. Although the output is not the fastest, everyone is friendly and trusts each other
              </Radio>
              <Radio value="balanced-efficiency">I take both and lean toward a balance</Radio>
            </Space>
          </Radio.Group>
        </Form.Item> */}

        {/* MBTi 性格板块 */}
        <div>
          <Form.Item
            name="mbti"
            label={<div className="py-3 text-xl font-bold font-ArchivoNarrow">{t('matchpage.character')}</div>}
            hasFeedback
            tooltip={t('matchpage.mbti')}
            style={{ marginBottom: 0 }}
          >
            <Select placeholder="Please select a character" className='font-ArchivoNarrow'>
              <Select.Option value={-1}>UnKnown</Select.Option>
              <Select.Option value={0}>INFP</Select.Option>
              <Select.Option value={1}>ENFP</Select.Option>
              <Select.Option value={2}>INFJ</Select.Option>
              <Select.Option value={3}>ENFJ</Select.Option>
              <Select.Option value={4}>INTJ</Select.Option>
              <Select.Option value={5}>ENTJ</Select.Option>
              <Select.Option value={6}>INTP</Select.Option>
              <Select.Option value={7}>ENTP</Select.Option>
              <Select.Option value={8}>ISFP</Select.Option>
              <Select.Option value={9}>ESFP</Select.Option>
              <Select.Option value={10}>ISTP</Select.Option>
              <Select.Option value={11}>ESTP</Select.Option>
              <Select.Option value={12}>ISFJ</Select.Option>
              <Select.Option value={13}>ESFJ</Select.Option>
              <Select.Option value={14}>ISTJ</Select.Option>
              <Select.Option value={15}>ESTJ</Select.Option>
            </Select>
          </Form.Item>
          <div className="mt-2 font-ArchivoNarrow">
            <a href="https://www.16personalities.com/free-personality-test" target="_blank" rel="noreferrer">
              {'Not sure your MBTi type? Take a quiz first >>'}
            </a>
          </div>
        </div>

        {/* 提交按钮 */}
        <Form.Item>
          <div className="frc-end mt-20 space-x-2">
            <Button loading={loading} type="primary" size="large" className="border-0 rounded-lg font-bold font-ArchivoNarrow" htmlType="submit">
              {t('matchpage.explore')}
            </Button>
          </div>
        </Form.Item>
      </Form>
      <Modal title={<h1>Today's Match</h1>} open={open} footer={null} onCancel={() => setOpen(false)}>
        <Suggest open={open} />
      </Modal>
    </div>
  )
}

export default MatchConfig
