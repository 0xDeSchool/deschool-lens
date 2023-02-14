import { useEffect, useState } from 'react'
import message from 'antd/es/message'
import Form from 'antd/es/form'
import Button from 'antd/es/button'
import Col from 'antd/es/col'
import Checkbox from 'antd/es/checkbox'
import Select from 'antd/es/select'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { CheckLabelList } from './CheckLabelList'

const MatchConfig = () => {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [label, setLabel] = useState('DAO TOOLS')

  const changeLabel = (tag: string, checked: boolean) => {
    if (checked) {
      setLabel(tag)
    }
  }

  useEffect(() => {
    setLoading(false)
  }, [])

  const submitMatchParams = async (values: any | undefined) => {
    if (!values) {
      values = form.getFieldsValue()
    }

    try {
      setLoading(true)
      // 判断表单是否通过验证
      const validResult = await form.validateFields()
      if (validResult?.errors) {
        return false
      }
      // 最后请求
      const params = {
        title: values?.project_name,
        founders: values?.founders,
        email: values?.email,
        desc: values?.project_des,
        wechatId: values?.project_wechatId,
      }
      console.log('params', params)

      // await creatProject(params)
      setLoading(false)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleJumpSuggest = async () => {
    await submitMatchParams(undefined)
    navigate(`/profile/suggested`)
  }

  return (
    <div>
      <Form
        form={form}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={values => submitMatchParams(values)}
        onFinishFailed={errors => {
          console.log('onFinishFailed', errors.values)
          message.error('验证失败，请检查表单')
        }}
        autoComplete="off"
        className="flex gap-20 <md:flex-col"
      >
        <div className="flex-1 flex flex-col">
          <div className="py-5 mt-5 text-xl font-bold">{t('matchpage.goals')}</div>
          <Form.Item name="goals" label=" " colon={false}>
            <Checkbox.Group>
              <div className="w-full grid grid-cols-24">
                {[
                  'I want to have my partners for a web3 start-up idea.',
                  'I want to find someone that can form a DAO together.',
                  'I want to find Hackathon teammates.',
                  'I want to make some friends in this industry.',
                  'I just want to browse what other people are doing.',
                ].map(value => (
                  <Col className="col-span-24" key={value}>
                    <Checkbox value={value} style={{ lineHeight: '32px' }}>
                      {value}
                    </Checkbox>
                  </Col>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>
          <div className="py-5 text-xl font-bold">{t('matchpage.fields')}</div>
          <div className="mt-2">
            <CheckLabelList
              labels={['DeFi', 'NFT', 'Blockchain Infra', 'GameFi', 'SocialFi', 'Protocol', 'DEX', 'CEX', 'Research']}
              changeLabel={changeLabel}
              label={label}
            />
          </div>
          <div className="py-5 mt-5 text-xl font-bold">{t('matchpage.belief')}</div>
          <Form.Item name="belief" label=" " colon={false}>
            <Checkbox.Group>
              <div className="w-full grid grid-cols-24">
                {[
                  'I believe in long-term value',
                  'I want to make money in Web3 industry ASAP',
                  'I want to have 10+ people team',
                  'I want to have an elite, agile squad, like 3~5 people',
                ].map(value => (
                  <Col className="col-span-24" key={value}>
                    <Checkbox value="I believe in long-term value" style={{ lineHeight: '32px' }}>
                      {value}
                    </Checkbox>
                  </Col>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>

          <div className="py-5 mt-5 text-xl font-bold">{t('matchpage.character')}</div>
          <Form.Item
            name="character"
            label=" "
            hasFeedback
            tooltip="解释一下"
            rules={[{ required: true, message: 'Please select your character!' }]}
          >
            <Select placeholder="Please select a character">
              <Select.Option value="ENTG">ENTG</Select.Option>
              <Select.Option value="???">???</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <div className="frc-end mt-20 space-x-2">
              <Button
                loading={loading}
                type="primary"
                size="large"
                className="rounded-lg font-bold"
                onClick={() => {
                  submitMatchParams(undefined)
                }}
                // disabled={!!error || Number(cost) === 0}
              >
                {/* {error || t('project_submitdirect_btn')} */}
                {t('matchpage.save')}
              </Button>
              <Button
                loading={loading}
                size="large"
                className="border-0 rounded-lg font-bold"
                onClick={() => {
                  handleJumpSuggest()
                }}
              >
                {t('matchpage.explore')}
              </Button>
            </div>
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}

export default MatchConfig
