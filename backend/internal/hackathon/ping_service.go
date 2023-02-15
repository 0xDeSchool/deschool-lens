package hackathon

import "context"

// Ping 专用
func (hm *HackathonManager) SayHello(ctx context.Context) string {
	return "Hello World"
}
