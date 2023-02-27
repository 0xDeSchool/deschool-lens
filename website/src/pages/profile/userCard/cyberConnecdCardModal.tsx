import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from 'antd/es/modal/Modal'
import { followersRequest } from '~/api/lens/follow/followers'
import { followingRequest } from '~/api/lens/follow/following'
import Skeleton from 'antd/es/skeleton'
import message from 'antd/es/message'
import Empty from 'antd/es/empty'
import { getExtendProfile } from '~/hooks/profile'
import ShowMoreLoading from '~/components/loading/showMore'
import { RoleType } from '~/lib/enum'
import { getUserContext, useAccount } from '~/context/account'
import { Link } from 'react-router-dom'
import type { ProfileExtend } from '~/lib/types/app'
import LensAvatar from './avatar'
import { useLazyQuery, useMutation } from '@apollo/client'
import { CC_FOLLOW, CC_UNFOLLOW, CC_REGISTER_SIGNING_KEY } from '~/api/cc/graphql'
import { generateSigningKey, getPublicKey, signWithSigningKey } from '~/api/cc/signingKey'
import { GET_FOLLOWING_BY_ADDRESS_EVM } from '~/api/cc/graphql/GetFollowingByAddressEVM'
const NAMESPACE = 'test'

const FollowersModal = (props: {
  routeAddress: string | undefined
  profileId: string | undefined
  type: 'followers' | 'following'
  visible: boolean
  closeModal: any
}) => {
  const { routeAddress, profileId, type, visible, closeModal } = props
  const { t } = useTranslation()
  const { cyberToken } = useAccount()
  const [follows, setFollows] = useState([] as Array<ProfileExtend | undefined | null>)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [ccFollow] = useMutation(CC_FOLLOW);
  const [ccUnfollow] = useMutation(CC_UNFOLLOW);
  const [getFollowingByAddressEVM] = useLazyQuery(GET_FOLLOWING_BY_ADDRESS_EVM)
  const [registerSigningKey] = useMutation(CC_REGISTER_SIGNING_KEY);
  const [toAddress, setToAddress] = useState<string>(
    "0x89c60C01F2E1d1b233253596bf1c2386bDfeB898"
  );
  const [signingKey, setSigningKey] = useState<CryptoKeyPair | null>(null);
  const [registered, setRegistered] = useState<boolean>(false);

  const getFollowings = async () => {
    const resp = await getFollowingByAddressEVM({
      variables: {
        address: routeAddress || cyberToken?.address,
      }
    })
  }

  const initList = async () => {
    setLoading(true)
    try {
      await getFollowings()
    } catch (error: any) {
      if (error && error.name && error.message) message.error(`${error.name}:${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (visible) {
      initList()
    }
  }, [visible])

  const handleAddMore = async () => {
    setLoadingMore(true)
    try {
      await getFollowingByAddressEVM()
    } catch (error: any) {
      if (error && error.name && error.message) message.error(`${error.name}:${error.message}`)
    } finally {
      setLoadingMore(false)
    }
  }

  const registerKey = async (signingKey: CryptoKeyPair) => {
    const publicKey = await getPublicKey(signingKey);

    const resp = await registerSigningKey({
      variables: {
        input: {
          address: routeAddress,
          publicKey,
        }
      }
    });
    setRegistered(true);
  };

  const handleClick = async (type: "follow" | "unfollow") => {
    let key = signingKey;
    if (!key) {
      key = await generateSigningKey();
      setSigningKey(key);
    }

    console.log(key);

    if (!key) {
      throw new Error("SigningKey is empty");
    }

    if (!registered) {
      await registerKey(key);
    }

    const operation = {
      name: type,
      from: routeAddress,
      to: toAddress,
      namespace: NAMESPACE,
      network: "ETH",
      alias: "",
      timestamp: Date.now()
    };

    const signature = await signWithSigningKey(JSON.stringify(operation), key);
    const publicKey = await getPublicKey(key);

    const params = {
      fromAddr: routeAddress,
      toAddr: toAddress,
      namespace: NAMESPACE,
      signature,
      signingKey: publicKey,
      operation: JSON.stringify(operation)
    };

    return params;
  };

  const handleFollow = async (type: "follow" | "unfollow") => {
    try {
      const params = await handleClick(type);
      if (type === "follow") {
        const resp = await ccFollow({
          variables: {
            address: params.fromAddr,
          }
        });
      } else {
        const resp = await ccUnfollow({
          variables: {
            address: params.fromAddr,
          }
        });
        // message.success(`success following ${followUser?.handle},tx is ${tx}`)
      }
    } catch (e) {
      console.log(e);
    } finally {
      console.log("finally");
    }
  };

  const role = getUserContext().getLoginRoles()

  return (
    <Modal
      title={t(type)}
      open={visible}
      destroyOnClose
      closable
      onCancel={e => {
        setFollows([] as Array<ProfileExtend | undefined | null>)
        setTotal(0)
        closeModal(e)
      }}
      footer={null}
    >
      {loading ? (
        <Skeleton />
      ) : (
        <div className="fcc-start max-h-600px space-y-2 overflow-auto scroll-hidden">
          <button onClick={() => handleFollow('follow')}>follow</button>
          {follows && follows.length > 0 ? (
            <div className="w-full">
              {follows?.map(follow => (
                <div key={follow?.id} className="relative border rounded-xl p-2 w-full frs-center">
                  <div className="relative w-60px h-60px">
                    <LensAvatar avatarUrl={follow?.avatarUrl} size={60} wrapperClassName="fcc-center w-full" />
                  </div>
                  <div className="flex-1 fcs-center ml-2">
                    <Link to={`/profile/${follow?.ownedBy}/resume`}>
                      <h1>{follow?.name}</h1>
                    </Link>
                    <p>{follow?.bio}</p>
                  </div>
                  <div>
                    {/* 这里有多种情况： */}
                    {/* 一、用户在看自己的 Following，此时可以显示 Unfollow 按钮。如果两人互关以文字形式写在名字旁边 */}
                    {/* 二、用户在看自己的Followers，此时有 Follow 按钮用以回关，如果双向关注则显示出来，hover上去变成 Unfollow */}
                    {/* 三、用户在看别人的 Following，啥事都不能做，没有按钮。如果别人和他的关注者双向关注则用文字显示出来 */}
                    {/* 四、用户在看别人的 Follower，啥事都不能做，没有按钮。如果别人和他的关注者双向关注则用文字显示出来 */}
                    {/* TODO */}
                    {!role.includes(RoleType.UserOfCyber) ? null : (
                      <button
                        type="button"
                        className="purple-border-button px-2 py-1"
                        onClick={() => {
                          if (follow?.isFollowedByMe) {
                            // handleUnFollow(follow)
                          } else {
                            // handleFollow(follow)
                          }
                        }}
                      >
                        {follow?.isFollowedByMe ? t('UnFollow') : t('Follow')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {loadingMore && (
                <div className="mt-10 w-full frc-center">
                  <ShowMoreLoading />
                </div>
              )}
              {follows && follows.length > 0 && total > follows.length && (
                <div className="text-center mt-10">
                  <button
                    type="button"
                    className={`bg-#1818180f border-#18181826 border-2 rounded-xl px-4 py-2 ${loadingMore ? 'cursor-not-allowed' : ''}`}
                    onClick={handleAddMore}
                  >
                    {t('SeeMore')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      )}
    </Modal>
  )
}
export default FollowersModal
