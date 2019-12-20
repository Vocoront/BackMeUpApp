using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace BackMeUpApp.Services
{
    public class ImageService
    {
        public static bool ValidateImages(List<IFormFile> files)
        {
            for (int i = 0; i < files.Count(); i++)
            {
                string ext = Path.GetExtension(files[i].FileName);
                switch (ext.ToLower())
                {
                    case ".gif":
                        return true;
                    case ".jpg":
                        return true;
                    case ".jpeg":
                        return true;
                    case ".png":
                        return true;
                    default:
                        return false;
                }
            }
            return true;

        }


        public static string SaveImagesToFS(List<IFormFile> images,string startName,string destination)
        {
            string imagesPath = "";
            if (images == null || images.Count() == 0)
                imagesPath = "#";
            else
                for (int i = 0; i < images.Count(); i++)
                {
                    string fileName1 = startName + i.ToString() + "." + images[i].FileName.Split(".")[1];
                    var filePath = Path.Combine(destination, fileName1);
                    using (var stream = System.IO.File.Create(filePath))
                    {
                       images[i].CopyTo(stream);
                    }
                    imagesPath += fileName1 + "#";
                }
            return imagesPath;
        }
    }
}
