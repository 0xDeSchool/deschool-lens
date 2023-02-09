package app

type VersionInfo struct {
	Version string
	Date    string
	Commit  string
	BuiltBy string
}

func (v *VersionInfo) String() string {
	return v.Version
}
