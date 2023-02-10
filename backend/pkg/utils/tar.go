package utils

import (
	"archive/tar"
	"compress/gzip"
	"io"
	"os"
	"path"
	"path/filepath"
)

func Uncompress(tarPath string, dest string) error {
	os.MkdirAll(dest, os.ModePerm)

	fr, err := os.Open(tarPath)
	if err != nil {
		return err
	}
	defer fr.Close()

	gr, err := gzip.NewReader(fr)
	if err != nil {
		return err
	}
	defer gr.Close()

	tr := tar.NewReader(gr)

	for {
		hdr, err := tr.Next()
		if err == io.EOF {
			break
		}

		if hdr.Typeflag != tar.TypeDir {
			os.MkdirAll(filepath.Join(dest, path.Dir(hdr.Name)), os.ModePerm)

			fw, _ := os.OpenFile(filepath.Join(dest, hdr.Name), os.O_CREATE|os.O_WRONLY, os.FileMode(hdr.Mode))
			if err != nil {
				return err
			}
			_, err = io.Copy(fw, tr)
			if err != nil {
				return err
			}
		}
	}
	return nil
}
