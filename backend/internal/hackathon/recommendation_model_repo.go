package hackathon

import "time"

type UserRecommendation struct {
	FromAddr string    `bson:"fromAddr"`
	ToAddr   string    `bson:"toAddr"`
	Reasons  []string  `bson:"reasons"`
	Used     time.Time `bson:"used"`
	Score    int       `bson:"score"`
}
