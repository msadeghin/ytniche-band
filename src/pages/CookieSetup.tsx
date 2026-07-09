import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Cookie, Shield, Upload, CheckCircle2, AlertTriangle,
  ArrowLeft, ExternalLink, Info, AlertCircle,
  FileText, Loader2, Youtube
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const LOCAL_SERVER = "http://localhost:8787";

export function CookieSetup() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [serverStatus, setServerStatus] = useState<"checking" | "online" | "offline">("checking");
  const [cookieStatus, setCookieStatus] = useState<"checking" | "configured" | "missing">("checking");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    checkServer();
  }, []);

  const checkServer = async () => {
    setServerStatus("checking");
    setCookieStatus("checking");

    try {
      const res = await fetch(`${LOCAL_SERVER}/api/health`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        setServerStatus("online");
        // Check cookie status
        const cookieRes = await fetch(`${LOCAL_SERVER}/api/cookies/status`, {
          signal: AbortSignal.timeout(3000),
        });
        if (cookieRes.ok) {
          const data = await cookieRes.json();
          setCookieStatus(data.configured ? "configured" : "missing");
        } else {
          setCookieStatus("missing");
        }
      } else {
        setServerStatus("offline");
        setCookieStatus("missing");
      }
    } catch {
      setServerStatus("offline");
      setCookieStatus("missing");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch(`${LOCAL_SERVER}/api/cookies/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setUploadResult(data);

      if (data.ok) {
        setCookieStatus("configured");
      }
    } catch (err: any) {
      setUploadResult({
        ok: false,
        message: `Connection failed: ${err.message}. Make sure the server is running on port 8787.`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/workflow">
            <Button variant="ghost" size="sm" className="mb-6 text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Workflow
            </Button>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-600/20 to-yellow-500/20 border border-orange-500/20 mx-auto mb-4">
            <Cookie className="w-8 h-8 text-orange-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Cookie Setup</h1>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Upload your YouTube cookies for real metadata — <strong className="text-amber-400">local-only</strong>, never shared
          </p>
        </motion.div>

        {/* Server Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className={`border ${
            serverStatus === "online"
              ? "border-green-500/30"
              : serverStatus === "checking"
              ? "border-dark-700/50"
              : "border-red-500/30"
          }`}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  serverStatus === "online"
                    ? "bg-green-500"
                    : serverStatus === "checking"
                    ? "bg-yellow-500 animate-pulse"
                    : "bg-red-500"
                }`} />
                <div>
                  <span className="text-sm font-medium text-white">
                    {serverStatus === "online" ? "Server Online" : serverStatus === "checking" ? "Checking Server..." : "Server Offline"}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {serverStatus === "online"
                      ? "http://localhost:8787"
                      : "Run 'bun run dev:server' in a separate terminal"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {cookieStatus === "configured" && (
                  <Badge variant="success" className="text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Cookies Ready
                  </Badge>
                )}
                {cookieStatus === "missing" && serverStatus === "online" && (
                  <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-400">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Missing
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={checkServer} className="text-xs">
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upload Section */}
        {serverStatus === "online" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="border-dark-700/50">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <FileText className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                  <h2 className="text-xl font-semibold text-white mb-2">Upload cookies.txt</h2>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Export your YouTube cookies using a browser extension and upload the file here.
                  </p>
                </div>

                {/* File input */}
                <div className="flex flex-col items-center gap-4 mb-6">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full max-w-md p-8 border-2 border-dashed border-dark-600 rounded-2xl hover:border-orange-500/50 hover:bg-dark-800/30 cursor-pointer transition-all text-center"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      {selectedFile ? selectedFile.name : "Click to select cookies.txt"}
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>

                  <Button
                    variant="gradient"
                    disabled={!selectedFile || isUploading}
                    onClick={handleUpload}
                    className="w-full max-w-md"
                  >
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    {isUploading ? "Uploading..." : "Upload Cookies"}
                  </Button>
                </div>

                {/* Upload result */}
                {uploadResult && (
                  <div className={`p-4 rounded-xl ${
                    uploadResult.ok
                      ? "bg-green-500/10 border border-green-500/30"
                      : "bg-red-500/10 border border-red-500/30"
                  }`}>
                    <div className="flex items-start gap-3">
                      {uploadResult.ok ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      )}
                      <p className={`text-sm ${uploadResult.ok ? "text-green-300" : "text-red-300"}`}>
                        {uploadResult.message}
                      </p>
                    </div>
                  </div>
                )}

                {/* After success */}
                {cookieStatus === "configured" && (
                  <div className="mt-6 text-center">
                    <Button
                      variant="gradient"
                      size="lg"
                      onClick={() => navigate("/workflow")}
                    >
                      <Youtube className="w-4 h-4 mr-2" />
                      Start Analysis
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Server offline message */}
        {serverStatus === "offline" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <h2 className="text-lg font-semibold text-white mb-2">Local Server Not Running</h2>
                <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                  The local backend server needs to be running for cookie upload. Open a second terminal and run:
                </p>
                <div className="bg-dark-900 rounded-xl p-4 mb-4 font-mono text-sm text-cyan-400 text-left">
                  bun run dev:server
                </div>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" size="sm" onClick={checkServer}>
                    Try Again
                  </Button>
                  <Link to="/workflow">
                    <Button variant="outline" size="sm">
                      Skip — Use Heuristic Mode
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Security info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-dark-800/50 bg-dark-900/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <Shield className="w-6 h-6 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-base font-semibold text-white mb-2">🔒 Security Guarantees</h3>
                  <ul className="space-y-2">
                    {[
                      "Cookies are saved ONLY to private/cookies.txt on your machine",
                      "Cookie content is NEVER sent to any remote server",
                      "Cookie content is NEVER displayed in the UI",
                      "Cookie content is NEVER logged",
                      "The .gitignore file protects private/ and cookies.txt from commits",
                      "Cookies are local-only credentials — treat them like passwords",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-base font-semibold text-white mb-2">💡 Need Help?</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Install a "cookies.txt" exporter browser extension</li>
                    <li>• Export cookies for youtube.com while logged in</li>
                    <li>• Re-export every 1-2 weeks when cookies expire</li>
                    <li>• Full guide: <code className="text-cyan-400">docs/COOKIES_LOCAL_ONLY.md</code></li>
                  </ul>
                </div>
              </div>

              {/* Skip link */}
              <div className="mt-6 pt-4 border-t border-dark-700/50 text-center">
                <Link to="/workflow">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    Skip cookies — use heuristic analysis mode
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
